import { useRef, useState } from "react";

/**
 * OtpInput – 6 segmented boxes that auto-advance on digit entry.
 * Exposes a hidden <input name={name}> carrying the concatenated value
 * so existing FormData-based submit handlers work without changes.
 */
export default function OtpInput({ name = "otp", onComplete }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const refs = useRef([]);

  function handleChange(index, e) {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    if (val && index < 5) refs.current[index + 1]?.focus();
    if (next.every(Boolean) && onComplete) onComplete(next.join(""));
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
    if (pasted.length === 6 && onComplete) onComplete(pasted);
  }

  return (
    <div className="otp-input-group" aria-label="6-digit verification code">
      {/* Hidden input carries the real value for FormData */}
      <input type="hidden" name={name} value={digits.join("")} />
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className="otp-box"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={d}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
