// src/components/TrustBadges.jsx
import React from 'react';

export default function TrustBadges(){
  return (
    <section className="container mx-auto mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Beneficios y garantías de QRTech">
      <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm">
        <strong>Retiro en San Lorenzo 987</strong>
        <p className="opacity-80">Microcentro de Tucumán</p>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm">
        <strong>Garantía QRTech escrita</strong>
        <p className="opacity-80">Equipos verificados</p>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm">
        <strong>Cuotas con todas las tarjetas</strong>
        <p className="opacity-80">Hasta 12 fijas</p>
      </div>
      <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm">
        <strong>WhatsApp directo</strong>
        <p className="opacity-80">Respuesta real, sin bots</p>
      </div>
    </section>
  );
}
