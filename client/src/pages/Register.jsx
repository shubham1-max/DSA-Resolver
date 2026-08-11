import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthHead from "../components/AuthHead";
import GoogleButton from "../components/GoogleButton";
import OtpInput from "../components/OtpInput";

function getStrength(password) {
  if (password.length === 0) return { level: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["", "Weak", "Fair", "Strong"];
  return { level: score, label: labels[score] };
}

export default function Register() {
  const navigate = useNavigate();
  const { signUp, completeOtpVerification, requestOtpResend, setNotice } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState("");

  const strength = getStrength(password);

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

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFieldError("");
    setNotice("");
    setSubmitting(true);

    try {
      const result = await signUp(form.get("name"), form.get("email"), form.get("password"));
      if (result?.requiresVerification) {
        setVerificationEmail(result.email);
      } else if (result?.success) {
        navigate("/solve");
      }
    } catch (error) {
      setFieldError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFieldError("");
    setSubmitting(true);

    try {
      await completeOtpVerification(verificationEmail, form.get("otp"));
      navigate("/solve");
    } catch (error) {
      setFieldError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <AnimatePresence mode="wait">
        {!verificationEmail ? (
          <motion.form
            key="register-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="auth-modal"
            onSubmit={handleSubmit}
          >
            <AuthHead label="register" title="Create account" onClose={() => navigate("/")} />
            <input name="name" type="text" placeholder="Full Name" required autoComplete="name" />
            <input name="email" type="email" placeholder="Email" required autoComplete="email" />
            <div className="password-field-wrap">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {password.length > 0 && (
              <div className="strength-bar-wrap">
                <div className="strength-bar">
                  <div className={`strength-fill strength-${strength.level}`} />
                </div>
                <span className={`strength-label strength-label-${strength.level}`}>{strength.label}</span>
              </div>
            )}
            {fieldError && <p className="form-error" role="alert">{fieldError}</p>}
            <button className="primary wide" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Register"}
            </button>
            <div className="auth-divider"><span>or</span></div>
            <GoogleButton label="Sign up with Google" />
            <Link className="link-button" to="/login">
              Already have an account?
            </Link>
          </motion.form>
        ) : (
          <motion.form
            key="verify-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="auth-modal"
            onSubmit={handleVerify}
          >
            <AuthHead label="verify" title="Check your email" onClose={() => setVerificationEmail("")} />
            <p className="auth-sub-text">
              We sent a 6-digit verification code to <strong>{verificationEmail}</strong>.
            </p>
            <OtpInput name="otp" />
            {fieldError && <p className="form-error" role="alert">{fieldError}</p>}
            <button className="primary wide" type="submit" disabled={submitting}>
              {submitting ? "Verifying..." : "Verify & Continue"}
            </button>
            <button
              type="button"
              className="link-button"
              onClick={handleResend}
              disabled={cooldown > 0}
              style={{ marginTop: "12px", fontSize: "13px" }}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive a code? Resend"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
