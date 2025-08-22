// src/components/TrustChips.jsx
import React from 'react';
import { Clock, Truck, ShieldCheck, LifeBuoy } from 'lucide-react';

const chips = [
  { icon: Clock, text: 'Expertos en Smartphones' },
  { icon: Truck, text: 'Envíos a todo el PAIS' },
  { icon: ShieldCheck, text: 'Garantía real' },
  { icon: LifeBuoy, text: 'Soporte 24h' },
];

export default function TrustChips() {
  return (
    <section className="w-full py-12 bg- from-primary/90 to-secondary/90">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {chips.map(({ icon: Icon, text }, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-2 bg-white rounded-full shadow-md py-3 px-4 hover:shadow-lg transition"
          >
            <Icon size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
