"use client";

import * as React from "react";

export default function MochiRating({
  value,
  onChange,
  disabled = false,
  label = "Note",
}: {
  value: number; // 0..5
  onChange: (n: number) => void;
  disabled?: boolean;
  label?: string;
}) {
  const v = Math.max(0, Math.min(5, Number.isFinite(value) ? value : 0));

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-extrabold text-zinc-700">{label}</span>

      <div className="flex items-center gap-2">
        <div className={`flex gap-2 ${disabled ? "opacity-60" : ""}`}>
          {Array.from({ length: 5 }).map((_, i) => {
            const n = i + 1;
            const active = n <= v;

            return (
              <button
                key={n}
                type="button"
                disabled={disabled}
                onClick={() => onChange(n)}
                aria-label={`${n} mochi`}
                title={disabled ? "Connecte-toi pour noter" : `${n}/5`}
                className={[
                  "mochi-btn",
                  active ? "mochi-active" : "mochi-idle",
                  disabled ? "mochi-disabled" : "",
                ].join(" ")}
              >
                <span className="mochi-shine" />
              </button>
            );
          })}
        </div>

        <span className="text-sm font-extrabold text-zinc-700 tabular-nums">
          {v}/5
        </span>
      </div>
    </div>
  );
}