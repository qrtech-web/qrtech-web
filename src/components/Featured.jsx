// src/components/Featured.jsx
import React from 'react';

const featuredItems = [1, 2, 3, 4, 5];

export default function Featured() {
  return (
    <section
  className="py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white"
  aria-label="Top 3 productos destacados"
>
  <h2
    className="text-4xl font-carter text-center mb-16"
    data-aos="fade-up"
  >
    Top <span className="text-indigo-400 font-bold">productos destacados</span> 2025
  </h2>

  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mx-auto">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="group border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
        data-aos="zoom-in"
        data-aos-delay={i * 150}
      >
        {/* Imagen responsiva 9:16 */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={`/img/productos/featured/${i}.png`}
            alt={`Producto ${i}`}
            className="w-full h-full object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Nombre */}
        
      </div>
    ))}
  </div>
</section>

  );
}
