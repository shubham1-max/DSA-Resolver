import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CompleteSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { finishGoogleSignup, setNotice } = useAuth();

  const { pendingToken, googleUser } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Guard: if someone lands here without going through Google first, redirect
  if (!pendingToken || !googleUser) {
    return (
      <section className="auth-page">
        <div className="auth-modal complete-signup-modal">
          <div className="complete-signup-header">
            <h2>Session expired</h2>
            <p className="complete-signup-sub">
              Please sign in with Google again to create your account.
            </p>
          </div>
          <button className="primary wide" onClick={() => navigate("/register")}>
            Back to Register
          </button>
        </div>
      </section>
    );
  }

  const strength = getStrength(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await finishGoogleSignup(pendingToken, password);
      navigate("/solve");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      // If the pending token expired, let them retry Google flow
      if (err.message?.includes("expired")) {
        setTimeout(() => navigate("/register"), 2500);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-modal complete-signup-modal" onSubmit={handleSubmit}>

        {/* Google profile preview */}
        <div className="complete-signup-header">
          {googleUser.picture ? (
            <img
              src={googleUser.picture}
              alt={googleUser.name}
              className="google-avatar"
            />
          ) : (
            <div className="google-avatar-fallback">
              {googleUser.name?.[0]?.toUpperCase() || "G"}
            </div>
          )}
          <div>
            <p className="eyebrow">almost there</p>
            <h2>Set your password</h2>
            <p className="complete-signup-sub">
              Signing up as <strong>{googleUser.name}</strong>
              <br />
              <span className="complete-signup-email">{googleUser.email}</span>
            </p>
          </div>
        </div>

        {/* Password field */}
        <div className="password-field-wrap">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Create a password (min. 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            autoFocus
          />
          <button
            type="button"
            className="toggle-pass"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        {/* Strength bar */}
        {password.length > 0 && (
          <div className="strength-bar-wrap" aria-label={`Password strength: ${strength.label}`}>
            <div className="strength-bar">
              <div
                className={`strength-fill strength-${strength.level}`}
                style={{ width: `${(strength.level / 3) * 100}%` }}
              />
            </div>
            <span className={`strength-label strength-label-${strength.level}`}>
              {strength.label}
            </span>
          </div>
        )}

        {/* Confirm password */}
        <input
          type={showPass ? "text" : "password"}
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />

        {/* Match indicator */}
        {confirm.length > 0 && (
          <p className={`match-hint ${password === confirm ? "match-ok" : "match-fail"}`}>
            {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
          </p>
        )}

        {/* Error */}
        {error && <p className="form-error" role="alert">{error}</p>}

        <button
          className="primary wide"
          type="submit"
          disabled={submitting}
          id="complete-signup-btn"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <button
          type="button"
          className="link-button"
          onClick={() => navigate("/register")}
        >
          ← Use a different account
        </button>
      </form>
    </section>
  );
}

// Password strength scorer
function getStrength(password) {
  if (password.length === 0) return { level: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["", "Weak", "Fair", "Strong"];
  return { level: score, label: labels[score] };
}
