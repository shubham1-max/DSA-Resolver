import { memo } from 'react';

export default memo(function InfoCard({ title, meta, children }) {
  return (
    <article className="info-card">
      <div className="info-title">
        <h3>{title}</h3>
        {meta && <span>{meta}</span>}
      </div>
      {children}
    </article>
  );
}
