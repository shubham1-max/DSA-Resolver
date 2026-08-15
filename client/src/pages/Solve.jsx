import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Activity,
  ArrowRight,
  Braces,
  Code2,
  Cpu,
  FileText,
  Gauge,
  Languages,
  Lightbulb,
  PlayCircle,
  Route,
  Wand2,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAwwwardsMotion } from "../hooks/useAwwwardsMotion";
import { detectTopic, languages, starterProblems, useSolver } from "../hooks/useSolver";
import Solution from "./Solution";

const solveStages = [
  { icon: Route, label: "Plan", copy: "Establish the pattern, constraints, and proof direction." },
  { icon: Code2, label: "Code", copy: "Compare the baseline against the optimal implementation." },
  { icon: FileText, label: "Trace", copy: "Inspect every changing value in a readable dry run." },
  { icon: Lightbulb, label: "Coach", copy: "Review edge cases, hints, and interview communication." },
];

const qualityNotes = ["Full prompt", "Language aware", "SSE streaming", "Saved history"];

export default function Solve() {
  const location = useLocation();
  const { refreshAfterSolve, setNotice } = useAuth();
  const [activeTab, setActiveTab] = useState("Plan");
  const solver = useSolver({ refreshAfterSolve, setNotice, initialQuestion: location.state?.question || "" });
  const shellRef = useRef(null);

  useAwwwardsMotion(shellRef, [solver.result?._id, solver.loading]);



  async function handleSolve() {
    await solver.resolveProblem();
    setActiveTab("Plan");
  }

  const topic = solver.question.trim() ? detectTopic(solver.question) : "Awaiting problem";
  const charCount = solver.question.trim().length;
  const wordCount = solver.question.trim() ? solver.question.trim().split(/\s+/).length : 0;

  return (
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        ref={shellRef} 
        className="solver-page solve-page-pro solve-page-animated"
      >
        

        <div className="solve-hero-wide">
          <div className="solve-hero-left">
            <div className="solver-heading solve-heading-pro solve-heading-wide">
              <p className="eyebrow solve-eyebrow" data-hero-reveal><Cpu size={15} /> Live backend solver</p>
              <h1>
                <span className="solve-title-line" data-hero-reveal>Structure the problem.</span>
                <span className="solve-title-line" data-hero-reveal>Stream the reasoning.</span>
              </h1>
              <p className="solve-copy-line" data-hero-reveal>
                Paste the full DSA prompt and work inside a larger input/output studio: pattern, plan, trace, code, and coach tabs stay visible with more room to think.
              </p>
            </div>
  
            <div className="solve-hero-chips" data-hero-reveal>
              <span><Activity size={15} /> {topic}</span>
              <span><Code2 size={15} /> {solver.language}</span>
              <span><Gauge size={15} /> {wordCount} words</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <div className="solve-hero-right" data-hero-reveal style={{ animationDelay: "200ms" }}>
            <div className="solve-hero-video-container">
              <video 
                src="/videos/demo_clip.mp4" 
                poster="/videos/demo_clip.jpg"
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="auto"
              />
            </div>
          </div>
        </div>

        <div className="solve-stage-strip" data-reveal-group>
          {solveStages.map(({ icon: Icon, label, copy }, index) => (
            <article className="solve-stage-card" key={label} data-tilt>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon size={21} />
              <h3>{label}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>

        <div className="solver-layout solve-workspace solve-workspace-large" data-reveal-group>
          <aside className="solver-card problem-panel prompt-card-pro solve-input-panel" data-tilt>
            <div className="panel-head prompt-head-pro">
              <div>
                <p className="eyebrow"><FileText size={14} /> Input studio</p>
                <h2>Problem statement</h2>
              </div>
              <label className="language-select" htmlFor="language-select">
                <Code2 size={16} />
                <select id="language-select" value={solver.language} onChange={(event) => solver.setLanguage(event.target.value)} aria-label="Select programming language">
                  {languages.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="prompt-meta-row">
              {qualityNotes.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <textarea
              className="solve-question-input"
              aria-label="Problem statement"
              value={solver.question}
              onChange={(event) => solver.setQuestion(event.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleSolve();
                }
              }}
              placeholder="Paste a full DSA question, constraints, and examples..."
            />

            <div className="detect-strip pro-detect-strip">
              <span><Activity size={15} /> Detected topic</span>
              <strong>{solver.detectedTopic || topic}</strong>
            </div>

            <div className="starter-list pro-starter-list" aria-label="Starter problems">
              {starterProblems.map((item) => (
                <button key={item} type="button" onClick={() => solver.setQuestion(item)} data-magnetic>
                  <Braces size={14} /> {item}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="primary wide solve-button solve-button-animated"
                style={{ justifyContent: 'space-between' }}
                type="button"
                onClick={handleSolve}
                disabled={solver.loading}
                data-glow
                aria-label={solver.loading ? "Resolving problem, please wait" : "Resolve the entered DSA problem"}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wand2 size={18} /> {solver.loading ? "Resolving..." : "Resolve problem"}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6, fontSize: '12px' }}>
                  <kbd style={{ fontFamily: 'var(--font-mono)' }}>⌘ ↵</kbd>
                  {solver.loading ? <PlayCircle size={17} className="spin-soft" /> : <ArrowRight size={17} />}
                </span>
              </button>
              {solver.loading && (
                <button
                  className="secondary"
                  type="button"
                  onClick={solver.cancelStream}
                  aria-label="Cancel AI resolution"
                >
                  Cancel
                </button>
              )}
            </div>
          </aside>

          <div className="answer-shell-pro solve-output-panel">
            <div className="answer-orbit" />
            <Solution
              result={solver.result}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loading={solver.loading}
              streamText={solver.streamText}
              problemId={solver.problemId}
              hintsUsed={solver.hintsUsed}
              onHintsUsedChange={solver.setHintsUsedCount}
            />
          </div>
        </div>
      </motion.section>
  );
}


