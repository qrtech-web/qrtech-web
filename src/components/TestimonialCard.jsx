// src/components/TestimonialCard.jsx
import React from 'react';

export default function TestimonialCard({ text, author, img }) {
  return (
    <article className="bg-white rounded-lg shadow-card p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
      <img
        src={img}
        alt={`Avatar de ${author}`}
        className="w-20 h-20 rounded-full border-4 border-primary mb-4 object-cover"
      />
      <p className="italic mb-4 text-gray-700">“{text}”</p>
      <span className="font-semibold text-primary">{author}</span>
    </article>
  );
}
