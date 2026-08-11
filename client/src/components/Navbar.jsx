import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/solve", label: "Solve" },
  { to: "/bank", label: "Bank" },
  { to: "/dashboard", label: "Dashboard" },
];

import { useRef, useEffect } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar" role="banner">
      <NavLink className="brand" to="/" aria-label="Go to home">
        <svg viewBox="0 0 100 100" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
          <path d="M 44 26 L 22 50 L 44 74" fill="none" stroke={theme === "dark" ? "#F4F3FC" : "#111827"} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 56 26 L 78 50 L 56 74" fill="none" stroke="#8A77F5" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>
          <strong>DSA RESOLVER</strong>
        </span>
      </NavLink>

      <nav className="nav-tabs" aria-label="Primary navigation">
        {navItems.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="account">
        <motion.button
          className="theme-toggle icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle dark mode"
          whileTap={{ scale: 0.85 }}
          whileHover={{ rotate: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex" }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {user ? (
          <>
            {(user.streak || 0) > 0 && (
              <span className="streak">{user.streak} day streak</span>
            )}
            <div className="avatar-wrapper" ref={dropdownRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <button
                className="avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="Account"
                type="button"
                aria-label={`Account menu for ${user.name ? user.name : user.email || ""}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {(user.name ? user.name : user.email ? user.email : "U").slice(0, 1).toUpperCase()}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <div className="user-dropdown-header">
                      <strong>{user.name ? user.name : "Solver"}</strong>
                      <span>{user.email || "Anonymous"}</span>
                    </div>
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item text-danger" onClick={() => { setDropdownOpen(false); signOut(); }}>
                      <LogOut size={14} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <NavLink className="primary small nav-auth" to="/login">
            Sign in
          </NavLink>
        )}
      </div>
    </header>
  );
}
