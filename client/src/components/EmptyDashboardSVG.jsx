export default function EmptyDashboardSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "1.5rem" }}>
      {/* Background abstract grids/wireframes */}
      <rect x="20" y="30" width="80" height="60" rx="8" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 4" />
      <path d="M20 50H100" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" />
      <path d="M40 30V90" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" />
      
      {/* Floating abstract chart elements */}
      <rect x="30" y="60" width="12" height="30" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="50" y="45" width="12" height="45" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="70" y="70" width="12" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
      
      {/* Central focus element (Activity pulse) */}
      <path d="M45 65L55 55L65 75L75 60" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="55" cy="55" r="3" fill="var(--primary)" />
      
      {/* Glowing accent dot */}
      <circle cx="75" cy="60" r="4" fill="var(--primary)" style={{ filter: 'drop-shadow(0 0 8px var(--primary))' }} />
    </svg>
  );
}
