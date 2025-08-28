// src/components/Filters.jsx
import React from 'react';

export default function Filters({ query, onChange }){
  return (
    <div className="container mx-auto mt-6">
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por modelo (ej: 13, 14 Pro Max)…"
        className="w-full rounded-xl border border-white/15 bg-white/5 p-3"
        aria-label="Buscar productos por modelo"
      />
    </div>
  );
}
