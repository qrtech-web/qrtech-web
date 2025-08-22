// src/components/MVSection.jsx
import React from 'react';

const sections = [
  {
    title: 'Misión',
    text: `Llevar la mejor experiencia Apple, con equipos originales, accesorios de calidad y atención experta, garantizando transparencia en cada paso y respaldo real en tu compra.`,
    className: 'data-aos="fade-right"',
  },
  {
    title: 'Visión',
    text: `Inspirar la revolución digital en el norte argentino a través de un ecosistema Apple que potencie la capacidad de creación y la tranquilidad de nuestros clientes.`,
    className: 'data-aos="fade-left "',
  },
];

export default function MVSection() {
  return (
    <section
      id="mision-vision"
      className="py-20 px-4 grid gap-8 sm:grid-cols-2 max-w-6xl mx-auto"
    >
      {sections.map(({ title, text }, i) => (
        <article
          key={i}
          className="bg-gray-900 text-white glass p-8 rounded-xl shadow-inner"
          data-aos={i === 0 ? 'fade-right' : 'fade-left'}
        >
          <h2 className="text-5xl font-carter text-indigo-400 mb-4">{title}</h2>
          <p className=" leading-relaxed tracking-wide ">{text}</p>
        </article>
      ))}
    </section>
  );
}
