import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Activity, Bookmark, CalendarCheck2, Flame, LineChart, ListChecks, LockKeyhole, Target, Trophy } from "lucide-react";
import InfoCard from "../components/InfoCard";
import StreakChart from "../components/StreakChart";
import BlurText from "../components/BlurText";
import SpotlightCard from "../components/SpotlightCard";
import FadeContent from "../components/FadeContent";
import { useAuth } from "../context/AuthContext";
import { useAwwwardsMotion } from "../hooks/useAwwwardsMotion";
import { detectTopic } from "../hooks/useSolver";
import EmptyDashboardSVG from "../components/EmptyDashboardSVG";
import EmptyAuthSVG from "../components/EmptyAuthSVG";

export default function Dashboard() {
  const { stats, history, user, isAuthenticated } = useAuth();
  const dashboardRef = useRef(null);
  const cursorRef = useRef(null);

  const focusQueue = history.length
    ? history.slice(0, 4)
    : [
        { _id: "placeholder-1", question: "Solve a graph traversal problem" },
        { _id: "placeholder-2", question: "Review dynamic programming states" },
        { _id: "placeholder-3", question: "Practice sliding window invariants" },
      ];

  const topicCounts = useMemo(() => {
    const uniqueHistory = Array.from(
      new Map(history.map(item => [item.question?.trim().toLowerCase(), item])).values()
    );
    const counts = uniqueHistory.reduce((acc, item) => {
      const topic = detectTopic(item.question || "");
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [history]);

  const metricIcons = [Trophy, Flame, Bookmark];

  useAwwwardsMotion(dashboardRef, [history.length, stats.length]);

  useEffect(() => {
    const root = dashboardRef.current;
    const cursor = cursorRef.current;
    if (!root || !cursor) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.42, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.42, ease: "power3.out" });
    const scale = gsap.quickTo(cursor, "scale", { duration: 0.24, ease: "power2.out" });
    const opacity = gsap.quickTo(cursor, "opacity", { duration: 0.2, ease: "power2.out" });

    const handleMove = (event) => {
      const rect = root.getBoundingClientRect();
      moveX(event.clientX - rect.left);
      moveY(event.clientY - rect.top);
      opacity(1);
    };

    const handleEnter = (event) => {
      if (event.target.closest("[data-cursor-focus]")) scale(1.9);
    };

    const handleLeave = (event) => {
      if (event.target.closest("[data-cursor-focus]")) scale(1);
    };

    const handleRootLeave = () => opacity(0);

    root.addEventListener("pointermove", handleMove);
    root.addEventListener("pointerover", handleEnter);
    root.addEventListener("pointerout", handleLeave);
    root.addEventListener("pointerleave", handleRootLeave);

    return () => {
      root.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerover", handleEnter);
      root.removeEventListener("pointerout", handleLeave);
      root.removeEventListener("pointerleave", handleRootLeave);
    };
  }, []);

  // Re-run interactive listeners when stats change, but not entrance animations

  return (
    <section ref={dashboardRef} className="dashboard-page animated-dashboard">
      <span ref={cursorRef} className="dashboard-cursor" aria-hidden="true" />

      <div className="dashboard-hero">
        <p className="eyebrow" data-hero-reveal><LineChart size={15} /> Learning cockpit</p>
        <h1 style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          <BlurText text="Track the shape" delay={120} animateBy="words" direction="bottom" />
          <BlurText text="of your DSA practice." delay={120} animateBy="words" direction="bottom" className="text-primary" />
        </h1>
        <p data-hero-reveal>
          {!isAuthenticated 
            ? "Sign in to see your stats, streak, and solve history." 
            : "Every solve, bookmark, hint, and streak becomes feedback for the next practice loop."}
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="empty-state" data-reveal-group>
          <EmptyAuthSVG />
          <h2>Sign in to view your dashboard.</h2>
          <p>Your solve history, streak, and topic distribution will appear here.</p>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Link className="primary" to="/login">Sign in</Link>
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state" data-reveal-group>
          <EmptyDashboardSVG />
          <h2>Your dashboard is waiting.</h2>
          <p>Solve your first problem to unlock your stats, topic distribution, and streak chart.</p>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Link className="primary" to="/solve">Open solver</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="metric-grid" data-reveal-group>
        {stats.map((stat, index) => {
          const Icon = metricIcons[index] || Activity;
          return (
            <SpotlightCard key={stat.label} className="metric-card dashboard-motion-card" data-tilt data-cursor-focus>
              <div className="metric-icon-orbit">
                <Icon size={22} />
              </div>
              <span className="metric-label">{stat.label}</span>
              <strong className="metric-value">{stat.value}</strong>
            </SpotlightCard>
          );
        })}
      </div>

      <div className="dashboard-panels" data-reveal-group>
        <div className="dashboard-panel chart-panel dashboard-motion-card" data-tilt data-cursor-focus>
          <StreakChart history={history} streak={user?.streak || 0} longestStreak={user?.longestStreak || 0} />
        </div>

        <div className="dashboard-motion-card focus-panel" data-tilt data-cursor-focus>
          <InfoCard title="Focus queue" meta="next reps">
            <div className="focus-list">
              {focusQueue.map((item, index) => (
                <div className="focus-item" key={item._id || item.question} data-reveal>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item.question}</p>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>

        <div className="dashboard-motion-card topic-panel" data-tilt data-cursor-focus>
          <InfoCard title="Topic distribution" meta={history.length ? "from history" : "waiting for solves"}>
            <div className="topic-list">
              {(topicCounts.length ? topicCounts : [["Arrays", 1], ["Graph", 1], ["Dynamic Programming", 1]]).map(([topic, count]) => {
                const uniqueHistoryLength = new Set(history.map(item => item.question?.trim().toLowerCase())).size;
                const width = history.length ? Math.max(16, Math.round((count / uniqueHistoryLength) * 100)) : 36;
                return (
                  <div className="topic-meter" key={topic} data-meter={`${width}%`}>
                    <div>
                      <span><Target size={14} /> {topic}</span>
                      <strong>{history.length ? count : "-"}</strong>
                    </div>
                    <i style={{ "--meter-width": `${width}%`, transition: "width 0.4s ease-out" }} />
                  </div>
                );
              })}
            </div>
          </InfoCard>
        </div>

        <div className="dashboard-panel rhythm-panel dashboard-motion-card" data-tilt data-cursor-focus>
          <CalendarCheck2 size={28} />
          <div>
            <p className="eyebrow">Practice rhythm</p>
            <h2>{user?.streak || 0} day streak</h2>
            <p>Best streak: {user?.longestStreak || 0} days. Keep the loop small, consistent, and reviewable.</p>
          </div>
            <ListChecks size={34} />
          </div>
        </div>
        </>
      )}
    </section>
  );
}
