// src/components/SortSelectCustom.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SORTS = [
  { key: "relevance", label: "Relevancia",    color: "bg-sky-600 text-white" },
  { key: "price_asc", label: "Precio: menor a mayor", color: "bg-emerald-600 text-white" },
  { key: "price_desc",label: "Precio: mayor a menor", color: "bg-rose-600 text-white" },
  { key: "featured",  label: "Destacados primero",     color: "bg-amber-600 text-black" },
];

export default function SortSelectCustom({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const current = useMemo(() => SORTS.find(s => s.key === value) || SORTS[0], [value]);

  // Cerrar con click fuera
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (!btnRef.current || !listRef.current) return;
      if (!btnRef.current.contains(e.target) && !listRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Navegación con teclado
  function onKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault(); setOpen(true); return;
    }
    if (open && e.key === "Escape") { e.preventDefault(); setOpen(false); btnRef.current?.focus(); }
  }

  return (
    <div className={`relative ${className}`} onKeyDown={onKeyDown}>
      <label className="inline-flex items-center gap-2 text-sm">
        <span className="opacity-70">Ordenar:</span>
        <button
          ref={btnRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${current.color}`}>
            {current.label}
          </span>
          <svg width="16" height="16" viewBox="0 0 20 20" className="opacity-80"><path fill="currentColor" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.24 4.38a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z"/></svg>
        </button>
      </label>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 z-[80] mt-2 w-[240px] rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur shadow-2xl p-1"
          >
            {SORTS.map((s) => {
              const active = s.key === value;
              return (
                <li
                  key={s.key}
                  role="option"
                  aria-selected={active}
                  tabIndex={0}
                  onClick={() => { onChange(s.key); setOpen(false); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(s.key); setOpen(false); }
                  }}
                  className={[
                    "mb-1 last:mb-0 cursor-pointer rounded-lg px-2 py-2 text-sm outline-none",
                    active ? "ring-2 ring-emerald-400/50" : "",
                    "hover:bg-white/10 focus:bg-white/10"
                  ].join(" ")}
                >
                  <div className={`inline-flex items-center rounded-md px-2 py-0.5 ${s.color}`}>
                    {s.label}
                  </div>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
