export default function EmptyBankSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "1.5rem" }}>
      {/* Abstract document/code wireframe */}
      <rect x="25" y="20" width="70" height="80" rx="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M40 40H80M40 55H70M40 70H80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15" strokeLinecap="round" />
      
      {/* Floating abstract shapes for "unsolved problems" */}
      <circle cx="35" cy="85" r="4" fill="currentColor" fillOpacity="0.1" />
      <rect x="75" y="80" width="10" height="10" rx="2" fill="currentColor" fillOpacity="0.1" />
      
      {/* Main magnifying glass / search focus */}
      <circle cx="65" cy="65" r="16" stroke="var(--teal)" strokeWidth="3" fill="var(--background)" />
      <path d="M76 76L86 86" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Glowing accent inside the lens */}
      <path d="M58 65L63 70L72 58" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px var(--teal))' }} />
    </svg>
  );
}
