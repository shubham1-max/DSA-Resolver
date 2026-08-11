import { useState } from 'react';
import { Clock, HardDrive, Zap, BookOpen, Variable, Play, Sparkles } from 'lucide-react';
import CodeBlock from './CodeBlock';
import InfoCard from './InfoCard';

export default function OptimalTabs({ result, language }) {
  const solutions = result?.optimalSolutions?.solutions || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const optimal = solutions[activeIdx];

  const renderStructuredList = (textOrArray) => {
    if (!textOrArray) return null;
    let steps = [];
    if (Array.isArray(textOrArray)) {
      steps = textOrArray;
    } else {
      let text = String(textOrArray);
      if (text.includes("|STEP|")) {
        steps = text.split("|STEP|");
      } else if (text.includes(" | ")) {
        steps = text.split(" | ");
      } else if (text.includes(" - ")) {
        steps = text.split(" - ");
      } else if (text.includes("\n")) {
        steps = text.split("\n");
      } else {
        steps = [text];
      }
    }

    return (
      <ul className="structured-list">
        {steps.filter(s => s.trim()).map((step, idx) => (
          <li key={idx}>
            <span className="step-bullet">{idx + 1}</span>
            <span className="step-text">{step.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="code-stage-layout">
      {/* ── Baseline (Brute Force) Card ── */}
      <div className="solution-code-card baseline-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="solution-card-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} style={{ color: 'var(--warning)' }} aria-hidden="true" />
            <h3 style={{ margin: 0 }}>Baseline</h3>
          </div>
        </div>
        {/* Complexity Badges */}
        <div className="complexity-badges">
          <div className="complexity-badge badge-amber">
            <Clock size={14} />
            <div>
              <strong>{result.bruteForce?.time || '-'}</strong>
              {result.bruteForce?.timeReason && <span>{result.bruteForce.timeReason}</span>}
            </div>
          </div>
          <div className="complexity-badge badge-amber">
            <HardDrive size={14} />
            <div>
              <strong>{result.bruteForce?.space || '-'}</strong>
              {result.bruteForce?.spaceReason && <span>{result.bruteForce.spaceReason}</span>}
            </div>
          </div>
        </div>
        {/* Explanation */}
        {Array.isArray(result.bruteForce?.explanation) ? (
          <ul className="explanation-points">{result.bruteForce.explanation.map((item, i) => <li key={i}>{item}</li>)}</ul>
        ) : (
          <p>{result.bruteForce?.explanation || 'No brute force explanation returned.'}</p>
        )}
        {/* Code */}
        <CodeBlock code={result.bruteForce?.code} language={language} />
      </div>

      {/* ── Optimized Solution Card ── */}
      <div className="solution-code-card optimal-card-wide animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="solution-card-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0 }}>Optimized Solution</h3>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="solution-tab-bar">
          {solutions.map((sol, idx) => (
            <button
              key={sol.label}
              type="button"
              className={idx === activeIdx ? 'sol-tab active' : 'sol-tab'}
              onClick={() => setActiveIdx(idx)}
            >
              {sol.label}
            </button>
          ))}
        </div>

        {optimal && (
          <>
            {/* Complexity Badges */}
            <div className="complexity-badges">
              <div className="complexity-badge badge-green">
                <Clock size={14} />
                <div>
                  <strong>{optimal.time || '-'}</strong>
                  {optimal.timeReason && <span>{optimal.timeReason}</span>}
                </div>
              </div>
              <div className="complexity-badge badge-green">
                <HardDrive size={14} />
                <div>
                  <strong>{optimal.space || '-'}</strong>
                  {optimal.spaceReason && <span>{optimal.spaceReason}</span>}
                </div>
              </div>
            </div>

            {/* Key Insight (Striver) */}
            {optimal.keyInsight && (
              <div className="key-insight-box">
                <Zap size={14} /> <strong>Key Insight:</strong> {optimal.keyInsight}
              </div>
            )}

            {/* Explanation Points */}
            {Array.isArray(optimal.explanation) ? (
              <ul className="explanation-points">{optimal.explanation.map((item, i) => <li key={i}>{item}</li>)}</ul>
            ) : (
              <p>{optimal.explanation}</p>
            )}

            {/* Code */}
            <CodeBlock code={optimal.code} language={language} />

            {/* ── Variant-Specific Sections ── */}

            {/* Love Babbar: Dry Run */}
            {optimal.dryRun && (
              <InfoCard title="Manual Dry Run" meta="step-by-step trace">
                <div className="dry-run-box">
                  {renderStructuredList(optimal.dryRun)}
                </div>
              </InfoCard>
            )}

            {/* Love Babbar: Variable Breakdown */}
            {optimal.whatEachVariableDoes && (
              <InfoCard title="Variable Breakdown" meta="what each variable stores">
                <div className="variable-breakdown">
                  <Variable size={14} />
                  <p>{optimal.whatEachVariableDoes}</p>
                </div>
              </InfoCard>
            )}

            {/* NeetCode: Intuition Analogy */}
            {optimal.intuitionAnalogy && (
              <InfoCard title="Visual Intuition" meta="real-world analogy">
                <p>{optimal.intuitionAnalogy}</p>
              </InfoCard>
            )}

            {/* NeetCode: Space Optimization */}
            {optimal.spaceOptimization && (
              <InfoCard title="Space Optimization" meta="memory trick">
                <p>{optimal.spaceOptimization}</p>
              </InfoCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}
