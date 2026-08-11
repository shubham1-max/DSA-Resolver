import { useNavigate, Link } from "react-router-dom";
import { Home, Wand2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="notfound-page"
      aria-labelledby="notfound-title"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="notfound-inner">
        {/* Illustration */}
        <svg className="notfound-svg" width="140" height="140" viewBox="0 0 140 140" fill="none" aria-hidden="true">
          <circle cx="70" cy="70" r="60" stroke="var(--line)" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="70" cy="70" r="40" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.3" />
          <text x="70" y="82" textAnchor="middle" fontSize="40" fontWeight="800" fill="var(--primary)" fontFamily="monospace">?</text>
          <circle cx="70" cy="70" r="6" fill="var(--primary)" opacity="0.12" style={{ filter: "blur(8px)" }} />
        </svg>

        <span className="notfound-code" aria-hidden="true">404</span>
        <h1 id="notfound-title">Page not found</h1>
        <p>The route you're looking for doesn't exist or may have moved. Don't worry — the algorithms are still here.</p>

        <div className="notfound-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={16} /> Go back
          </button>
          <Link className="primary" to="/">
            <Home size={16} /> Home
          </Link>
          <Link className="secondary" to="/solve">
            <Wand2 size={16} /> Solver
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
