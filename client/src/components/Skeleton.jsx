import React from 'react';

export default function Skeleton({ className = "", style = {}, width, height, borderRadius = "8px" }) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width: width || "100%",
        height: height || "100%",
        borderRadius,
        ...style
      }}
    />
  );
}
