import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Binary,
  BookMarked,
  BrainCircuit,
  CheckCircle2,
  Code2,
  FileText,
  GitBranch,
  Layers3,
  LineChart,
  Play,
  Radar,
  Sparkles,
  Wand2,
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import DecryptedText from "../components/DecryptedText";
import { detectTopic } from "../hooks/useSolver";
import useScrollReveal from "../hooks/useScrollReveal";

const pipeline = [
  { number: "01", label: "Read", copy: "Capture the statement, examples, and constraints without losing context." },
  { number: "02", label: "Plan", copy: "Name the pattern and form an approach you can explain." },
  { number: "03", label: "Trace", copy: "Walk the changing values before committing to code." },
  { number: "04", label: "Review", copy: "Keep the solution, complexity, and lessons for next time." },
];

const features = [
  { icon: BrainCircuit, title: "Reasoning before code", copy: "Build intuition and compare a baseline with the optimal approach." },
  { icon: GitBranch, title: "Pattern recognition", copy: "Surface the likely DSA topic while you are still reading the prompt." },
  { icon: Code2, title: "Language-ready output", copy: "Move from the plan to an implementation in the language you choose." },
  { icon: BookMarked, title: "A useful archive", copy: "Return to solved problems with their explanation and trace intact." },
];

const starter = "Given an integer array nums and an integer k, return the length of the longest subarray whose sum is less than or equal to k.";

export default function Home() {
  const navigate = useNavigate();
  const workspaceRef = useRef(null);
  const containerRef = useRef(null);
  const [problem, setProblem] = useState(starter);
  const [topic, setTopic] = useState(detectTopic(starter));

  useScrollReveal(containerRef);

  function handleProblemChange(value) {
    setProblem(value);
    setTopic(value.trim() ? detectTopic(value) : "Awaiting input");
  }

  function openSolver() {
    if (!problem.trim()) return;
    navigate("/solve", { state: { question: problem } });
  }

  function handleWorkspaceTilt(event) {
    const workspace = workspaceRef.current;
    if (!workspace || event.pointerType === "touch") return;
    const rect = workspace.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 3;
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -2;
    workspace.style.setProperty("--workspace-rotate-x", `${rotateX.toFixed(2)}deg`);
    workspace.style.setProperty("--workspace-rotate-y", `${rotateY.toFixed(2)}deg`);
  }

  function resetWorkspaceTilt() {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    workspace.style.setProperty("--workspace-rotate-x", "0deg");
    workspace.style.setProperty("--workspace-rotate-y", "0deg");
  }

  return (
    <div className="home-page-pro home-page-corrected" ref={containerRef}>
      <PageTransition>
        <div className="home-top-split">
        <section className="home-hero home-hero-rebuilt">
          <div className="home-intro scroll-reveal-left stagger-1">
            <p className="hero-kicker"><Sparkles size={15} /> DSA Resolver</p>
            <h1 className="hero-title home-title-rebuilt">
              <span>Turn the prompt into</span>
              <span>
                <DecryptedText
                  text="a path you can defend."
                  speed={75}
                  maxIterations={12}
                  sequential={true}
                  revealDirection="start"
                  animateOn="view"
                  className="revealed"
                  encryptedClassName="encrypted"
                />
              </span>
            </h1>
            <p className="hero-copy">A focused workspace for breaking down DSA problems, testing the idea, and arriving at code with a clear explanation behind it.</p>
            <div className="home-stage-list" aria-label="Learning stages">
              <span><i>01</i> Plan</span>
              <span><i>02</i> Code</span>
              <span><i>03</i> Trace</span>
              <span><i>04</i> Coach</span>
            </div>
            <div className="hero-actions">
              <button className="primary hero-cta" type="button" onClick={openSolver}><Play size={17} /> Start with this problem</button>
              <Link className="secondary hero-cta" to="/dashboard">View dashboard <ArrowRight size={17} /></Link>
            </div>
          </div>
        </section>

        <div className="home-editor-wrapper scroll-reveal-right stagger-2">
          <section
            ref={workspaceRef}
            className="home-editor-panel home-editor-tilt"
          aria-label="Problem editor"
          onPointerMove={handleWorkspaceTilt}
          onPointerLeave={resetWorkspaceTilt}
        >
          <div className="home-editor-head">
            <span className="editor-index">01</span>
            <div>
              <p className="editor-kicker">Problem workspace</p>
              <h2>What are you solving?</h2>
            </div>
            <span className="editor-topic"><Radar size={14} /> {topic}</span>
          </div>
          <label className="home-editor-label" htmlFor="home-problem-input">
            <span>Paste the full prompt, including constraints and examples.</span>
            <span>{problem.length} characters</span>
          </label>
          <textarea
            id="home-problem-input"
            className="home-problem-input"
            value={problem}
            onChange={(event) => handleProblemChange(event.target.value)}
            placeholder="Start writing a DSA problem..."
          />
          <div className="home-editor-footer">
            <div className="editor-signals">
              <span><FileText size={15} /> full prompt</span>
              <span><Binary size={15} /> live reasoning</span>
              <span><CheckCircle2 size={15} /> saved review</span>
            </div>
            <button className="editor-resolve" type="button" onClick={openSolver}>Resolve <Wand2 size={16} /></button>
          </div>
        </section>
        </div>
        </div>

        <section className="home-flow-section">
          <div className="section-heading home-section-heading scroll-reveal">
            <p className="eyebrow"><Layers3 size={15} /> Your learning loop</p>
            <h2>Keep the hard part visible from first read to final explanation.</h2>
          </div>
          <div className="home-flow-grid">
            {pipeline.map((item, index) => (
              <article className={`home-flow-card scroll-reveal-scale stagger-${index + 1}`} key={item.label}>
                <span>{item.number}</span>
                <h3>{item.label}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-product-section">
          <div className="home-product-copy scroll-reveal-left">
            <p className="eyebrow"><LineChart size={15} /> Product workspace</p>
            <h2>Build a practice system, not a pile of answers.</h2>
            <p>Each solve becomes something you can revisit: the pattern, the tradeoffs, the trace, and your own explanation.</p>
            <Link className="secondary hero-cta" to="/bank">Open problem bank <ArrowRight size={17} /></Link>
          </div>
          <div className="feature-grid home-feature-grid">
            {features.map(({ icon: Icon, title, copy }, index) => (
              <article className={`feature-card home-feature-card scroll-reveal-right stagger-${index + 1}`} key={title}>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </PageTransition>
    </div>
  );
}
