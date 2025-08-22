// src/components/PaymentSplit.jsx
import React from 'react';

const paymentLogos = ['1', '2', '3', '4'];

export default function PaymentSplit() {
  return (
    <section
      className="payments py-20 px-4"
      aria-label="Medios de pago"
    >
      <h2
        className="text-3xl font-bold text-center mb-12"
        data-aos="fade-up"
      >
        Medios de pago
      </h2>
      <div className="payments__grid">
        {paymentLogos.map((logo, i) => (
          <img
            key={logo}
            src={`/logos/l${logo}.svg`}
            alt={`Logo medio de pago ${logo}`}
            data-aos="zoom-in"
            data-aos-delay={i * 100}
          />
        ))}
      </div>
    </section>
  );
}
