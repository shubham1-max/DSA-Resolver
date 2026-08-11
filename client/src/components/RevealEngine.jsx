import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BookOpen, Code2, GraduationCap, Route } from "lucide-react";
import ExplainBack from "./ExplainBack";
import HintLadder from "./HintLadder";
import InfoCard from "./InfoCard";
import OptimalTabs from "./OptimalTabs";
import TraceTable from "./TraceTable";
import CodeBlock from "./CodeBlock";

const stages = [
  {
    tab: "Plan",
    icon: Route,
    title: "Plan",
    copy: "Intuition, first principles, and the optimal direction.",
  },
  {
    tab: "Code",
    icon: Code2,
    title: "Code",
    copy: "Brute force and optimized implementation views.",
  },
  {
    tab: "Trace",
    icon: BookOpen,
    title: "Trace",
    copy: "Dry-run table for variables, decisions, and state changes.",
  },
  {
    tab: "Coach",
    icon: GraduationCap,
    title: "Coach",
    copy: "Hints, explain-back prompt, edge cases, and interview tips.",
  },
];

export default function RevealEngine({
  result,
  activeTab,
  setActiveTab,
  loading,
  streamText,
  problemId,
  hintsUsed = 0,
  onHintsUsedChange,
}) {
  const stageRef = useRef(null);
  const activeIndex = Math.max(0, stages.findIndex((stage) => stage.tab === activeTab));

  useEffect(() => {
    if (!stageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stage-reveal-active",
        { y: 24, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.48, ease: "power2.out" }
      );
    }, stageRef);
    return () => ctx.revert();
  }, [activeTab, result, loading]);

  return (
    <div className="visual-reveal-engine" ref={stageRef}>
      <div className="visual-stage-rail" aria-label="Solution stages">
        {stages.map(({ tab, icon: Icon, title, copy }, index) => {
          const isActive = activeTab === tab;
          const isUnlocked = Boolean(result) || loading || index === 0;
          return (
            <button
              key={tab}
              type="button"
              className={`visual-stage-card ${isActive ? "active" : ""} ${isUnlocked ? "unlocked" : "locked"}`}
              onClick={() => setActiveTab(tab)}
              data-magnetic
            >
              <span className="visual-stage-index">{String(index + 1).padStart(2, "0")}</span>
              <Icon size={22} />
              <strong>{title}</strong>
              <small>{copy}</small>
            </button>
          );
        })}
      </div>

      <div className="stage-progress-track" aria-hidden="true">
        <i style={{ width: `${((activeIndex + 1) / stages.length) * 100}%` }} />
      </div>

      {loading && (
        <div className="stream-stage-shell stage-reveal-active" style={{ paddingBottom: '60px' }}>
          <div className="stream-stage-header">
            <span className="live-pulse" />
            <div>
              <p className="eyebrow">AI Engine</p>
              <h3>Structuring logic and streaming response...</h3>
            </div>
          </div>
          <div className="thinking-skeleton">
            <div className="thinking-line title"></div>
            <div className="thinking-line"></div>
            <div className="thinking-line"></div>
            <div className="thinking-line short"></div>
            
            <div className="thinking-box"></div>
          </div>
        </div>
      )}

      {!loading && result && (
        <div className="stage-reveal-active">
          <ResultView
            result={result}
            activeTab={activeTab}
            problemId={problemId}
            hintsUsed={hintsUsed}
            onHintsUsedChange={onHintsUsedChange}
          />
        </div>
      )}
    </div>
  );
}

function ResultView({ result, activeTab, problemId, hintsUsed, onHintsUsedChange }) {
  const optimal = result.optimalSolutions?.solutions?.[0];

  if (activeTab === "Code") {
    return <div className="result-view-animated visual-stage-content"><OptimalTabs result={result} language={result?.language || 'C++'} /></div>;
  }

  if (activeTab === "Trace") {
    return <div className="result-view-animated visual-stage-content"><TraceTable traceTable={result.traceTable} /></div>;
  }

  if (activeTab === "Coach") {
    return (
      <div className="coach-grid result-view-animated visual-stage-content">
        <HintLadder
          hints={result.hints}
          problemId={problemId}
          hintsUsed={hintsUsed}
          onHintsUsedChange={onHintsUsedChange}
        />
        <ExplainBack 
          interviewTip={result.interviewTip} 
          explainBackPrompt={result.explainBackPrompt} 
          problemId={problemId}
          question={result?.question}
          correctSolution={optimal?.explanation || optimal?.code}
        />
        <InfoCard title="Edge cases">
          <ul>{(result.edgeCases || []).map((item) => <li key={item}>{item}</li>)}</ul>
        </InfoCard>
      </div>
    );
  }

  return (
    <div className="result-stack result-view-animated visual-stage-content plan-stage-grid">
      <InfoCard title="Intuition" meta={optimal?.keyInsight}>
        {Array.isArray(result.intuition) ? (
          <ul>{result.intuition.map((item, i) => <li key={i}>{item}</li>)}</ul>
        ) : (
          <p>{result.intuition}</p>
        )}
      </InfoCard>
      <InfoCard title="First principles">
        <ul>{(result.firstPrinciples || []).map((item) => <li key={item}>{item}</li>)}</ul>
      </InfoCard>
      {result.bruteForce && (
        <InfoCard title="Brute force baseline" meta={`${result.bruteForce?.time || "-"} time / ${result.bruteForce?.space || "-"} space`}>
          {Array.isArray(result.bruteForce.explanation) ? (
            <ul>{result.bruteForce.explanation.map((item, i) => <li key={i}>{item}</li>)}</ul>
          ) : (
            result.bruteForce.explanation && <p>{result.bruteForce.explanation}</p>
          )}
          {result.bruteForce.code && (
            <div style={{ marginTop: '16px' }}>
              <CodeBlock code={result.bruteForce.code} language={result?.language || 'C++'} />
            </div>
          )}
        </InfoCard>
      )}
    </div>
  );
}
