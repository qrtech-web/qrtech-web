// src/components/QuickFilters.jsx
import React from "react";

/**
 * Filtros rápidos basados en variantes.
 * props:
 *  - value: string[]  (ej: ['sellado', 'b90'])
 *  - onChange: (next: string[]) => void
 */
const OPTIONS = [
  { key: "disp",    label: "Disponibles" },   // al menos 1 variante con stock !== false
  { key: "sellado", label: "Sellado" },       // alguna variante con condicion "sellado"
  { key: "b90",     label: "Batería ≥90%" },  // alguna variante con batería >= 90
  { key: "128",     label: "128GB o más" },   // alguna variante con storage >= 128
  { key: "aplus",   label: "Usado A+" },      // alguna variante con condicion "usado a+"
];

export default function QuickFilters({ value = [], onChange }) {
  const has = (k) => value.includes(k);
  const toggle = (k) => {
    if (!onChange) return;
    const next = has(k) ? value.filter(x => x !== k) : [...value, k];
    onChange(next);
  };

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2.5">
      {OPTIONS.map(opt => (
        <button
          key={opt.key}
          onClick={() => toggle(opt.key)}
          aria-pressed={has(opt.key)}
          className={[
            "rounded-full px-3.5 py-2 text-[13px] border transition",
            has(opt.key)
              ? "bg-emerald-600/20 border-emerald-400/30 text-emerald-200"
              : "bg-white/5 border-white/10 hover:bg-white/10"
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
