import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

// Orchestrate a smooth cinematic handoff
const splash = document.getElementById('splash');
const root = document.getElementById('root');

if (splash) {
  // Wait precisely 1.5s to allow the progress bar to finish its first sweep
  setTimeout(() => {
    splash.remove();
    window.dispatchEvent(new Event('splash-finished'));
  }, 1500);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

