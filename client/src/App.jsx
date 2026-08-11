import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Skeleton from "./components/Skeleton";

// Lazy loaded heavy routes
const Bank = lazy(() => import("./pages/Bank"));
const CompleteSignup = lazy(() => import("./pages/CompleteSignup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Solution = lazy(() => import("./pages/Solution"));
const Solve = lazy(() => import("./pages/Solve"));

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
import "./App.css";
import "./proof-studio.css";
import { useEffect, useState } from "react";

function AppRoutes() {
  const { notice, setNotice, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px' }}>
        <Skeleton width="100%" height="60px" borderRadius="12px" style={{ marginBottom: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', flex: 1 }}>
          <Skeleton width="100%" height="100%" borderRadius="12px" />
          <Skeleton width="100%" height="100%" borderRadius="12px" />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <main className="app-shell" id="main-content">
      <Navbar />
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="modern-toast"
            role="status"
          >
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")}>Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {window.splashFinishedState && (
          <Suspense fallback={
            <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px' }}>
              <Skeleton width="100%" height="100%" borderRadius="12px" />
            </div>
          }>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/solve" element={<ProtectedRoute><Solve /></ProtectedRoute>} />
              <Route path="/bank" element={<Bank />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/complete-signup" element={<CompleteSignup />} />
              <Route path="/solution/:id" element={<ProtectedRoute><Solution /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        )}
      </AnimatePresence>
    </main>
    </ErrorBoundary>
  );
}

export default function App() {
  const [splashFinished, setSplashFinished] = useState(!document.getElementById('splash'));

  useEffect(() => {
    if (splashFinished) {
      window.splashFinishedState = true;
      return;
    }
    const handleSplashFinished = () => {
      setSplashFinished(true);
      window.splashFinishedState = true;
    };
    window.addEventListener('splash-finished', handleSplashFinished, { once: true });
    return () => window.removeEventListener('splash-finished', handleSplashFinished);
  }, [splashFinished]);

  return (
    <BrowserRouter>
      {splashFinished && <AppRoutes />}
    </BrowserRouter>
  );
}
