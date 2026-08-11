import { useState, useEffect, useRef } from "react";
import InfoCard from "./InfoCard";
import { evaluateAnswer } from "../api";

export default function ExplainBack({ interviewTip, explainBackPrompt, problemId, question, correctSolution }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [evalError, setEvalError] = useState("");
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!problemId) return;
    try {
      const savedAnswer = localStorage.getItem(`explainBack_${problemId}`);
      if (savedAnswer) setAnswer(savedAnswer);
      const savedEval = localStorage.getItem(`explainEval_${problemId}`);
      if (savedEval) {
        setEvalResult(JSON.parse(savedEval));
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  }, [problemId]);

  // Animate score count-up
  useEffect(() => {
    if (!evalResult?.score) return;
    const target = evalResult.score;
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [evalResult?.score]);

  function handleAnswerChange(e) {
    const val = e.target.value;
    setAnswer(val);
    if (problemId) localStorage.setItem(`explainBack_${problemId}`, val);
  }

  async function handleSubmit() {
    if (!answer.trim()) return;
    setEvaluating(true);
    setEvalError("");
    try {
      const result = await evaluateAnswer({
        question: question || "Unknown question",
        studentAnswer: answer,
        correctSolution: Array.isArray(correctSolution)
          ? correctSolution.join(" ")
          : correctSolution || "Unknown correct solution",
      });
      setEvalResult(result);
      if (problemId) localStorage.setItem(`explainEval_${problemId}`, JSON.stringify(result));
      setSubmitted(true);
    } catch (err) {
      console.error("Evaluation failed", err);
      setEvalError("Failed to evaluate answer. Please try again.");
    } finally {
      setEvaluating(false);
    }
  }

  function handleEdit() {
    setSubmitted(false);
    setEvalError("");
  }

  let scoreClass = "poor";
  if (evalResult?.score >= 85) scoreClass = "excellent";
  else if (evalResult?.score >= 70) scoreClass = "good";
  else if (evalResult?.score >= 50) scoreClass = "needs-work";

  return (
    <InfoCard title="Explain back">
      <p className="explain-tip">{interviewTip}</p>
      <p className="explain-prompt">{explainBackPrompt}</p>

      {!submitted ? (
        <div className="explain-input-wrap">
          <textarea
            className="explain-textarea"
            value={answer}
            onChange={handleAnswerChange}
            placeholder="Say it in your own words before moving on..."
            rows={3}
            disabled={evaluating}
          />
          {evalError && (
            <p className="form-error" role="alert" style={{ marginTop: "8px" }}>
              {evalError}
            </p>
          )}
          <button
            className="primary small explain-btn"
            onClick={handleSubmit}
            disabled={!answer.trim() || evaluating}
          >
            {evaluating ? "Evaluating..." : "Submit for Evaluation"}
          </button>
        </div>
      ) : (
        <div className="explain-success">
          <div className="explain-saved-answer">
            <strong>Your Answer:</strong>
            <p style={{ margin: "8px 0 0 0" }}>{answer}</p>
          </div>

          {evalResult && (
            <div className="eval-result">
              <div className={`eval-score-ring ${scoreClass}`}>
                {displayScore}%
              </div>
              <div className="eval-verdict">{evalResult.verdict}</div>
              <p className="eval-feedback">{evalResult.feedback}</p>

              {evalResult.missedConcepts && evalResult.missedConcepts.length > 0 && (
                <>
                  <strong style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>
                    Missed Concepts:
                  </strong>
                  <ul className="eval-missed">
                    {evalResult.missedConcepts.map((concept, i) => (
                      <li key={i}>{concept}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          <button type="button" className="primary small" onClick={handleEdit} style={{ marginTop: "16px" }}>
            Edit Answer
          </button>
        </div>
      )}
    </InfoCard>
  );
}
