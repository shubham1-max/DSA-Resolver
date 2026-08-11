import { useEffect, useState } from 'react';

export default function LightRays({ 
  color = 'var(--teal)', 
  opacity = 0.08, 
  count = 8,
  className = '' 
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) return null;

  const rays = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    const delay = (i * 0.5) % 3;
    return (
      <div
        key={i}
        className="light-ray"
        style={{
          '--ray-angle': `${angle}deg`,
          '--ray-delay': `${delay}s`,
          '--ray-color': color,
          '--ray-opacity': opacity,
        }}
      />
    );
  });

  return (
    <div className={`light-rays-container ${className}`} aria-hidden="true">
      {rays}
    </div>
  );
}
