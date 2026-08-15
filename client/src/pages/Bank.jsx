import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Archive, Bookmark, CalendarDays, Filter, LockKeyhole, Search, Star, TerminalSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SpotlightCard from "../components/SpotlightCard";
import FadeContent from "../components/FadeContent";
import EmptyBankSVG from "../components/EmptyBankSVG";
import EmptyAuthSVG from "../components/EmptyAuthSVG";

gsap.registerPlugin(ScrollTrigger);

const languageFilters = ["All", "C++", "Java", "Python", "JavaScript", "C"];

export default function Bank() {
  const { history, toggleSaved, isAuthenticated, setNotice } = useAuth();
  const [languageFilter, setLanguageFilter] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const bankRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchesQuery = item.question?.toLowerCase().includes(debouncedQuery.toLowerCase());
      if (debouncedQuery.trim() && !matchesQuery) return false;
      if (savedOnly && !item.bookmarked) return false;
      if (languageFilter !== "All" && item.language !== languageFilter) return false;
      return true;
    });
  }, [history, languageFilter, savedOnly, debouncedQuery]);

  const savedCount = history.filter((item) => item.bookmarked).length;
  const uniqueSolvesCount = new Set(history.map(item => item.question?.trim().toLowerCase())).size;

  useEffect(() => {
    const root = bankRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from(".bank-hero > *", {
        y: 10,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        stagger: 0.04,
      });

      gsap.from(".bank-stat", {
        y: 15,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        stagger: 0.04,
      });

      gsap.from(".bank-toolbar", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.from(".bank-list-shell > *", {
        y: 15,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        stagger: 0.04,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  async function handleToggleSaved(id) {
    try {
      await toggleSaved(id);
    } catch (error) {
      setNotice(error.message || "Failed to toggle bookmark");
    }
  }

  return (
      <section ref={bankRef} className="bank-page">
        
        <div className="bank-hero">
          <p className="eyebrow"><Archive size={15} /> Archive</p>
          <h1>Problem bank</h1>
          <p>
            Your solved problems, filtered for fast review sessions.
          </p>
        </div>

        <div className="bank-stats">
          <article className="bank-stat">
            <TerminalSquare size={22} />
            <span>Total solves</span>
            <strong>{uniqueSolvesCount}</strong>
          </article>
          <article className="bank-stat">
            <Bookmark size={22} />
            <span>Saved</span>
            <strong>{savedCount}</strong>
          </article>
        <article className="bank-stat">
          <Filter size={22} />
          <span>Showing</span>
          <strong>{filtered.length}</strong>
        </article>
      </div>

      <div className="bank-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search solved problems" />
        </label>
        <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)}>
          {languageFilters.map((item) => (
            <option key={item} value={item}>{item === "All" ? "All languages" : item}</option>
          ))}
        </select>
        <label className="filter-check switch-check">
          <input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} />
          Saved only
        </label>
      </div>

      <div className="bank-list-shell" data-reveal-group>
        {!isAuthenticated && (
          <div className="empty-state">
            <EmptyAuthSVG />
            <h2>Sign in to load your solved problems.</h2>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <Link className="primary" to="/login">Sign in</Link>
            </div>
          </div>
        )}

        {isAuthenticated && filtered.length === 0 && (
          <div className="empty-state">
            <EmptyBankSVG />
            <h2>No matching problems yet.</h2>
            <p>Try changing filters or solve a fresh problem from the Solve page.</p>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <Link className="secondary" to="/solve">Open solver</Link>
            </div>
          </div>
        )}

        {filtered.map((item, index) => (
          <SpotlightCard key={item._id} className="history-item rich-history-item" spotlightColor="var(--line-strong)">
            <div className="history-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="history-main">
              <strong>{item.question}</strong>
              <span><CalendarDays size={14} /> {item.language} / {new Date(item.solvedAt || item.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="history-actions">
              <Link className="status-pill status-link" style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" }} to={`/solution/${item._id}`} state={{ fromHistory: true }}>Open</Link>
              <button className="status-pill status-button" style={{ transition: "transform 150ms ease, background 150ms ease" }} type="button" onClick={() => handleToggleSaved(item._id)}>
                <Star size={14} fill={item.bookmarked ? "var(--warning)" : "none"} color={item.bookmarked ? "var(--warning)" : "currentColor"} /> {item.bookmarked ? "Saved" : "Save"}
              </button>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

