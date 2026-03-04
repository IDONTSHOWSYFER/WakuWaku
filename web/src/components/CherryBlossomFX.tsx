"use client";

import { useEffect, useMemo, useState } from "react";

type Petal = {
  id: number;
  left: number;      // %
  top: number;       // %
  size: number;      // px
  dur: number;       // s
  delay: number;     // s
  drift: number;     // px
  rot: number;       // deg
  opacity: number;   // 0..1
  blur: number;      // px
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function CherryBlossomFX({ density = 10 }: { density?: number }) {
  const [enabled, setEnabled] = useState(false);

  // ✅ DEBUG: on force l'effet à ON (pour vérifier que ça s'affiche)
  useEffect(() => {
    setEnabled(true);
  }, []);

  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: density }).map((_, i) => ({
      id: i,
      left: rand(0, 100),
      top: rand(-15, 105),
      size: rand(10, 18),
      dur: rand(10, 18),
      delay: rand(-18, 0),
      drift: rand(30, 110) * (Math.random() > 0.5 ? 1 : -1),
      rot: rand(-40, 40),
      opacity: rand(0.16, 0.28), // un peu + visible
      blur: rand(0, 1.2),
    }));
  }, [density]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="fx-layer pointer-events-none">
      <div className="fx-shimmer" />
      {petals.map((p) => (
        <span
          key={p.id}
          className="fx-petal"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              ["--drift" as any]: `${p.drift}px`,
              ["--rot" as any]: `${p.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}