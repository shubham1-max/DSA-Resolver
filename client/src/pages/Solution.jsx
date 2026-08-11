import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CircleDashed, Sparkles, Loader2 } from "lucide-react";
import Skeleton from "../components/Skeleton";
import RevealEngine from "../components/RevealEngine";
import { getProblemById } from "../api";

export default function Solution({
  result,
  activeTab,
  setActiveTab,
  loading,
  streamText,
  problemId,
  hintsUsed,
  onHintsUsedChange,
}) {
  const { id } = useParams();
  const location = useLocation();
  const [fetchedPayload, setFetchedPayload] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [localActiveTab, setLocalActiveTab] = useState("Plan");

  useEffect(() => {
    if (!result && !location.state?.result && id && location.state?.fromHistory) {
      setFetchLoading(true);
      getProblemById(id)
        .then((data) => setFetchedPayload(data.aiResponse))
        .catch((err) => setFetchError(err.message))
        .finally(() => setFetchLoading(false));
    }
  }, [id, result, location.state]);

  const payload = result || location.state?.result || fetchedPayload;
  const currentTab = activeTab || localActiveTab;
  const setCurrentTab = setActiveTab || setLocalActiveTab;
  const isLive = loading;

  if (fetchLoading) {
    return (
      <section className="answer-panel content-panel solve-answer-large" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <Skeleton width="100px" height="36px" borderRadius="18px" />
          <Skeleton width="100px" height="36px" borderRadius="18px" />
          <Skeleton width="100px" height="36px" borderRadius="18px" />
          <Skeleton width="100px" height="36px" borderRadius="18px" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Skeleton width="60%" height="24px" borderRadius="4px" />
          <Skeleton width="100%" height="16px" borderRadius="4px" />
          <Skeleton width="90%" height="16px" borderRadius="4px" />
          <Skeleton width="95%" height="16px" borderRadius="4px" />
          <Skeleton width="100%" height="16px" borderRadius="4px" />
          <Skeleton width="85%" height="16px" borderRadius="4px" />
        </div>
      </section>
    );
  }

  if (fetchError && !payload) {
    return (
      <section className="answer-panel content-panel solve-answer-large">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Error</p>
            <h2>Failed to load solution</h2>
          </div>
        </div>
        <p className="empty" style={{ color: "var(--danger)" }}>{fetchError}</p>
        <Link to="/bank" className="primary">Back to Bank</Link>
      </section>
    );
  }

  if (!payload && !loading) {
    return (
      <section className="answer-panel solve-answer-large empty-answer-panel visual-empty-output">
        <div className="panel-head answer-head-pro">
          <div>
            <p className="eyebrow"><Sparkles size={14} /> DSA Resolver</p>
            <h2>Reveal engine</h2>
          </div>
          <div className="status-pill">Waiting</div>
        </div>
        <div className="empty-output-hero">
          <CircleDashed size={42} />
          <span>01 / 04</span>
          <h3>Resolve once, then reveal every stage visually.</h3>
          <p>Plan, Code, Trace, and Coach will appear as large animated stage cards with dedicated space for reasoning, implementation, dry run, and review.</p>
        </div>
        
      </section>
    );
  }

  return (
    <section className="answer-panel solve-answer-large">
      <div className="panel-head answer-head-pro">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> Output studio</p>
          <h2>{payload?.topic || "Streaming solution"}</h2>
        </div>
        <div className="status-pill">{isLive ? "Live" : "Ready"}</div>
      </div>

      <RevealEngine
        result={payload}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        loading={isLive}
        streamText={streamText}
        problemId={problemId || id}
        hintsUsed={hintsUsed}
        onHintsUsedChange={onHintsUsedChange}
      />
    </section>
  );
}
