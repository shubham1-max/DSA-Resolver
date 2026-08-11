export default function EmptyAuthSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "1.5rem" }}>
      {/* Abstract structural grid */}
      <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" strokeDasharray="4 4" />
      <path d="M15 60H105M60 15V105" stroke="currentColor" strokeWidth="2" strokeOpacity="0.05" />
      
      {/* Floating particles */}
      <circle cx="35" cy="40" r="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="85" cy="80" r="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="80" y="35" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
      
      {/* Main Lock Icon wireframe */}
      <rect x="45" y="55" width="30" height="24" rx="4" stroke="var(--danger)" strokeWidth="3" fill="var(--background)" />
      <path d="M52 55V46C52 41.5817 55.5817 38 60 38C64.4183 38 68 41.5817 68 46V55" stroke="var(--danger)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Glowing keyhole accent */}
      <circle cx="60" cy="67" r="3" fill="var(--danger)" style={{ filter: 'drop-shadow(0 0 6px var(--danger))' }} />
      <path d="M59 70L58 74H62L61 70" fill="var(--danger)" />
    </svg>
  );
}
