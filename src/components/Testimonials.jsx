// src/components/Testimonials.jsx
import React from 'react';
import TestimonialCard from './TestimonialCard';

const data = [
  { text: 'Compré mi iPhone 14 y me acompañaron todo el proceso.', author: 'Lucía R.', img: '/avatars/av1.png' },
  { text: 'Servicio técnico en 24 h. Profesionales y honestos.', author: 'Mariano G.', img: '/avatars/av2.png' },
  { text: 'La mejor atención post-venta de Tucumán.', author: 'Ana P.', img: '/avatars/av3.png' },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-light-bg text-dark-bg">
      <h2 className="text-3xl font-bold text-center mb-12">Clientes felices</h2>
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((t, i) => <TestimonialCard key={i} {...t} />)}
      </div>
    </section>
  );
}
