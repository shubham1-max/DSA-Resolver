import { useEffect, useState } from "react";
import { revealHint } from "../api";
import InfoCard from "./InfoCard";

const hintSteps = [
  { level: 1, label: "Hint 1", key: "hint1" },
  { level: 2, label: "Hint 2", key: "hint2" },
  { level: 3, label: "Pseudocode", key: "pseudocode" },
];

export default function HintLadder({ hints, problemId, hintsUsed = 0, onHintsUsedChange }) {
  const [localUsed, setLocalUsed] = useState(hintsUsed);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const unlocked = Math.max(hintsUsed, localUsed);

  useEffect(() => {
    setLocalUsed(hintsUsed);
  }, [hintsUsed]);

  async function unlockNext() {
    if (unlocked >= 3) return;

    setError("");
    setBusy(true);

    try {
      if (problemId) {
        const payload = await revealHint(problemId);
        onHintsUsedChange?.(payload.hintsUsed);
        setLocalUsed(payload.hintsUsed);
      } else {
        const next = unlocked + 1;
        setLocalUsed(next);
        onHintsUsedChange?.(next);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <InfoCard title="Hints">
      <ol className="hint-ladder">
        {hintSteps.map(({ level, label, key }) => {
          const visible = unlocked >= level;
          return (
            <li key={key} className={visible ? "hint-visible" : "hint-locked"}>
              <strong>{label}</strong>
              {visible ? <p>{hints?.[key]}</p> : <p className="hint-mask">Locked — reveal one step at a time.</p>}
            </li>
          );
        })}
      </ol>

      {unlocked < 3 && (
        <button className="primary small wide" type="button" onClick={unlockNext} disabled={busy}>
          {busy ? "Unlocking..." : `Reveal ${hintSteps[unlocked]?.label || "next hint"}`}
        </button>
      )}

      {error && <p className="hint-error">{error}</p>}
    </InfoCard>
  );
}
