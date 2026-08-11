import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import AuthHead from "../components/AuthHead";
import OtpInput from "../components/OtpInput";
import { useAuth } from "../context/AuthContext";

function getStrength(password) {
  if (password.length === 0) return { level: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["", "Weak", "Fair", "Strong"];
  return { level: score, label: labels[score] };
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset, completePasswordReset, requestOtpResend } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(newPassword);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleResend() {
    if (cooldown > 0) return;
    try {
      await requestOtpResend(verificationEmail);
      setCooldown(60);
    } catch (error) {
      setFieldError(error.message);
    }
  }

  async function handleRequestReset(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    setFieldError("");
    setSubmitting(true);

    try {
      await requestPasswordReset(email);
      setVerificationEmail(email);
      setCooldown(60);
    } catch (error) {
      setFieldError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const otp = String(form.get("otp") || "").trim();
    setFieldError("");

    if (newPassword.length < 8) {
      setFieldError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await completePasswordReset(verificationEmail, otp, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      setFieldError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="auth-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="auth-modal"
          style={{ textAlign: "center", gap: "16px" }}
        >
          <span style={{ fontSize: "2.5rem" }}>✓</span>
          <h2>Password reset!</h2>
          <p className="auth-sub-text">Redirecting you to sign in…</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <AnimatePresence mode="wait">
        {!verificationEmail ? (
          <motion.form
            key="request-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="auth-modal"
            onSubmit={handleRequestReset}
          >
            <AuthHead label="reset" title="Forgot Password" onClose={() => navigate("/login")} />
            <p className="auth-sub-text">
              Enter your email address and we'll send you a 6-digit code to reset your password.
            </p>
            <input name="email" type="email" placeholder="Email" required autoComplete="email" />
            {fieldError && <p className="form-error" role="alert">{fieldError}</p>}
            <button className="primary wide" type="submit" disabled={submitting}>
              {submitting ? "Sending code..." : "Send Reset Code"}
            </button>
            <Link className="link-button" to="/login">
              ← Back to login
            </Link>
          </motion.form>
        ) : (
          <motion.form
            key="reset-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="auth-modal"
            onSubmit={handleResetSubmit}
          >
            <AuthHead label="verify" title="Set New Password" onClose={() => setVerificationEmail("")} />
            <p className="auth-sub-text">
              We sent a 6-digit verification code to <strong>{verificationEmail}</strong>.
            </p>
            <OtpInput name="otp" />
            <div className="password-field-wrap">
              <input
                name="newPassword"
                type={showPass ? "text" : "password"}
                placeholder="New Password (min 8 chars)"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass((p) => !p)}
                aria-label={showPass ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {newPassword.length > 0 && (
              <div className="strength-bar-wrap">
                <div className="strength-bar">
                  <div className={`strength-fill strength-${strength.level}`} />
                </div>
                <span className={`strength-label strength-label-${strength.level}`}>{strength.label}</span>
              </div>
            )}
            {fieldError && <p className="form-error" role="alert">{fieldError}</p>}
            <button className="primary wide" type="submit" disabled={submitting}>
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              className="link-button"
              onClick={handleResend}
              disabled={cooldown > 0}
              style={{ fontSize: "13px" }}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
