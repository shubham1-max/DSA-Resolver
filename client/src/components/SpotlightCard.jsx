import { useRef, useState } from 'react';

export default function SpotlightCard({ children, className = '', spotlightColor, ...props }) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const defaultColor = "color-mix(in srgb, var(--primary) 10%, transparent)";

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="spotlight-card-wrapper"
      style={{ position: 'relative', overflow: 'hidden', ...props.style }}
      {...props}
    >
      <div
        className="spotlight-effect"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor || defaultColor}, transparent 40%)`,
          transition: 'opacity 0.4s ease',
          zIndex: 0,
        }}
      />
      <div className={className} style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
