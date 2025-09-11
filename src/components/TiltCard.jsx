// src/components/TiltCard.jsx
import React, { useRef, useState } from "react";

export default function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -8; // ángulo X
    const ry = (px - 0.5) * 8;  // ángulo Y
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`,
    });
  };

  const onLeave = () =>
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)" });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-150 will-change-transform ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
