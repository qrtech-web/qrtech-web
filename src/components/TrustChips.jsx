// src/components/MVSection.jsx
import React from "react";
import { Sparkles, Truck, ShieldCheck, Headphones } from "lucide-react";

export default function MVSection() {
  const items = [
    { icon: <Sparkles className="w-4 h-4" />, text: "Expertos en Smartphones" },
    { icon: <Truck className="w-4 h-4" />, text: "Envíos a todo el PAÍS" },
    { icon: <ShieldCheck className="w-4 h-4" />, text: "Garantía 90 días" },
    { icon: <Headphones className="w-4 h-4" />, text: "Soporte 24h" },
  ];

  return (
    <section className="bg-slate-900/70 supports-[backdrop-filter]:backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map((it, i) => (
            <li
              key={i}
              className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 text-[13px] leading-tight text-white/90 flex items-center gap-2"
            >
              <span className="shrink-0 text-indigo-300">{it.icon}</span>
              <span className="whitespace-pre-line">{it.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
