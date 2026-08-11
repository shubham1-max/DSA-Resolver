import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GIS_SRC = "https://accounts.google.com/gsi/client";
let gisPromise;

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);

  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
      const script = existing || document.createElement("script");

      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) resolve(window.google.accounts.id);
        else reject(new Error("Google Identity Services did not initialize."));
      };
      script.onerror = () => reject(new Error("Could not load Google Sign-In. Check your internet connection."));

      if (!existing) document.head.appendChild(script);
    });
  }

  return gisPromise;
}

export default function GoogleButton({ label = "Continue with Google" }) {
  const { signInWithGoogle, setNotice } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const containerRef = useRef(null);
  const buttonId = useId().replace(/:/g, "");

  async function finishGoogleCredential(credential) {
    if (!credential) {
      setNotice("Google did not return a credential. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithGoogle(credential);
      if (result.needsPassword) {
        navigate("/complete-signup", {
          state: {
            pendingToken: result.pendingToken,
            googleUser: result.googleUser,
          },
        });
      } else {
        navigate("/solve");
      }
    } catch (err) {
      setNotice(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function renderFallbackButton(googleId) {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    googleId.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: "continue_with",
      width: Math.min(containerRef.current.offsetWidth || 360, 420),
    });
    setFallbackVisible(true);
  }

  async function handleClick() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE") {
      setNotice("Google Client ID is not configured. Add VITE_GOOGLE_CLIENT_ID to client/.env");
      return;
    }

    setNotice("");
    setLoading(true);

    try {
      const googleId = await loadGoogleIdentity();

      googleId.initialize({
        client_id: clientId,
        callback: (response) => finishGoogleCredential(response.credential),
        cancel_on_tap_outside: true,
        auto_select: false,
      });

      googleId.prompt((notification) => {
        const blocked = notification.isNotDisplayed() || notification.isSkippedMoment();
        if (blocked) {
          renderFallbackButton(googleId);
          setNotice("Use the Google button below to continue.");
        }
      });
    } catch (error) {
      setNotice(error.message || "Google Sign-In is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`google-btn-wrapper ${fallbackVisible ? "has-google-fallback" : ""}`}>
      {!fallbackVisible && (
        <button
          type="button"
          className="google-btn"
          onClick={handleClick}
          disabled={loading}
          id={`google-signin-${buttonId}`}
        >
          {loading ? <span className="google-btn-spinner" /> : <GoogleIcon />}
          <span>{loading ? "Connecting to Google..." : label}</span>
        </button>
      )}
      <div ref={containerRef} className="google-rendered-btn" aria-live="polite" />
    </div>
  );
}
