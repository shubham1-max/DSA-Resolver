/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearSession,
  completeGoogleSignup,
  getHistory,
  getMe,
  getSession,
  googleAuth,
  login,
  register,
  saveSession,
  toggleBookmark,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [notice, setNotice] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session?.token) {
      setAuthLoading(false);
      return;
    }

    getMe()
      .then((profile) => {
        setUser(profile);
        return refreshHistory();
      })
      .catch(() => clearSession())
      .finally(() => setAuthLoading(false));
  }, []);

  async function refreshHistory() {
    const payload = await getHistory().catch(() => ({ problems: [] }));
    setHistory(payload.problems || []);
    return payload.problems || [];
  }

  async function refreshProfile() {
    const profile = await getMe();
    setUser(profile);
    return profile;
  }

  async function refreshAfterSolve() {
    await Promise.all([refreshHistory(), refreshProfile()]);
  }

  async function toggleSaved(problemId) {
    await toggleBookmark(problemId);
    await refreshHistory();
  }

  async function signIn(email, password) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const payload = await login(normalizedEmail, password);
    if (payload?.requiresVerification) {
      return { requiresVerification: true, email: normalizedEmail };
    }
    if (!payload?.token) {
      throw new Error("Sign-in could not be completed. Please try again.");
    }
    saveSession({ token: payload.token, user: payload.user });
    // Use profile from login response directly — avoids redundant /user/me call
    const profile = payload.user || { email: normalizedEmail, name: "Solver" };
    setUser(profile);
    refreshHistory().catch(() => {});
    setNotice("Signed in. Your solves will be saved.");
  }

  async function signUp(name, email, password) {
    const payload = await register(name, email, password);
    if (payload?.requiresVerification) {
      return { requiresVerification: true, email: payload.email };
    }
    // Auto-login immediately after registration (if somehow they bypassed verification)
    if (payload?.token) {
      saveSession({ token: payload.token, user: payload.user });
      const profile = payload.user || { name, email };
      setUser(profile);
      refreshHistory().catch(() => {});
      setNotice("Account created. Welcome!");
      return { success: true };
    } else {
      setNotice("Account created. Please sign in to continue.");
      return { success: true };
    }
  }

  async function completeOtpVerification(email, otp) {
    const payload = await verifyOtp(email, otp);
    if (payload?.token) {
      saveSession({ token: payload.token, user: payload.user });
      const profile = payload.user || { email };
      setUser(profile);
      await refreshHistory();
      setNotice("Account verified. Welcome!");
      return { success: true };
    }
    throw new Error("Verification failed");
  }

  async function requestOtpResend(email) {
    await resendOtp(email);
    setNotice("A new code has been sent to your email.");
  }

  async function requestPasswordReset(email) {
    await forgotPassword(email);
    setNotice("If an account exists, a reset code was sent.");
  }

  async function completePasswordReset(email, otp, newPassword) {
    await resetPassword(email, otp, newPassword);
    setNotice("Password reset successful. You can now log in.");
  }

  // Step 1: Verify Google token.
  // • Existing user  → saves session, sets user, returns { needsPassword: false }
  // • New user       → returns { needsPassword: true, pendingToken, googleUser }
  async function signInWithGoogle(idToken) {
    const payload = await googleAuth(idToken);

    if (payload.needsPassword) {
      // New user — hand back the pending data; GoogleButton will navigate to /complete-signup
      return {
        needsPassword: true,
        pendingToken: payload.pendingToken,
        googleUser: payload.googleUser,
      };
    }

    // Existing user — log them in directly
    saveSession({ token: payload.token, user: payload.user });
    const profile = await getMe().catch(() => payload.user);
    setUser(profile);
    await refreshHistory();
    setNotice("Signed in with Google. Your solves will be saved.");
    return { needsPassword: false };
  }

  // Step 2: New Google user submits their chosen password → account created
  async function finishGoogleSignup(pendingToken, password) {
    const payload = await completeGoogleSignup(pendingToken, password);
    saveSession({ token: payload.token, user: payload.user });
    const profile = await getMe().catch(() => payload.user);
    setUser(profile);
    await refreshHistory();
    setNotice("Account created. Your solves will be saved.");
    return { user: profile };
  }

  function signOut() {
    clearSession();
    setUser(null);
    setHistory([]);
    setNotice("Signed out.");
  }

  const stats = useMemo(() => {
    const uniqueSolvesCount = new Set(history.map(item => item.question?.trim().toLowerCase())).size;
    const solved = user?.totalSolved ?? uniqueSolvesCount;
    const streak = user?.streak ?? 0;
    const bookmarked = history.filter((item) => item.bookmarked).length;

    return [
      { label: "Solved", value: solved },
      { label: "Streak", value: `${streak}d` },
      { label: "Saved", value: bookmarked },
    ];
  }, [history, user]);

  const value = {
    user,
    history,
    stats,
    notice,
    setNotice,
    refreshHistory,
    refreshAfterSolve,
    signIn,
    signUp,
    completeOtpVerification,
    requestOtpResend,
    requestPasswordReset,
    completePasswordReset,
    signInWithGoogle,
    finishGoogleSignup,
    signOut,
    toggleSaved,
    isAuthenticated: Boolean(user),
    authLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
