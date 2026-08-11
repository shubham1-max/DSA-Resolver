import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const langMap = {
  'C++': 'cpp', 'Java': 'java', 'Python': 'python',
  'JavaScript': 'javascript', 'Go': 'go', 'Rust': 'rust',
};

export default function CodeBlock({ code, language = 'C++' }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const mapped = langMap[language] || language.toLowerCase();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed silently
    }
  }

  if (!code) return <p className="code-empty">No code returned.</p>;

  return (
    <div className="code-block-wrapper" data-glow>
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        <motion.button
          whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
          className={`code-copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          type="button"
          aria-label="Copy code"
        >
          {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
        </motion.button>
      </div>
      <SyntaxHighlighter
        language={mapped}
        style={theme === 'dark' ? vscDarkPlus : oneLight}
        showLineNumbers
        customStyle={{
          margin: 0,
          borderRadius: '0 0 8px 8px',
          fontSize: '0.9rem',
          lineHeight: '1.7',
          padding: '24px 20px',
          backgroundColor: theme === 'dark' ? '#0d1117' : '#f8fafc',
          overflowX: 'auto',
        }}
        lineNumberStyle={{ 
          color: theme === 'dark' ? '#4b5563' : '#94a3b8', 
          fontSize: '0.8rem', minWidth: '40px', paddingRight: '16px', textAlign: 'right' 
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
