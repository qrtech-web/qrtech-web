// src/components/FormasDePago.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Logos (usá las rutas que ya tengas en /public; podés agregar/quitar sin tocar el layout) */
const logos = [
  { src: "logos//visa.jpg", alt: "Visa" },
  { src: "logos//mastercard.png", alt: "Mastercard" },
  { src: "logos//mercado.png", alt: "Mercado Pago" },
  { src: "logos//amex.png", alt: "American Express" },
  { src: "logos//sucredito.png", alt: "Sucrédito" },
  { src: "logos//nx.png", alt: "Naranja X" },
];

/** Odómetro liviano para el número de cuotas */
function useCountUp(finalValue = 12, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let rafId, start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / durationMs);
      // arranca rápido y suaviza al final
      setValue(Math.max(1, Math.round(finalValue * (0.4 + 0.6 * p))));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [finalValue, durationMs]);
  return value;
}

const cardVariants = { hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1 } };
const logoVariants = { rest: { y: 0 }, hover: { y: -2 } };

export default function FormasDePago() {
  const cuotas = useCountUp(12, 900);

  return (
    <section
      id="medios-pago"
      className="relative py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white"
      aria-label="Medios de pago y financiación"
    >
      <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-2 items-center">
        {/* Texto / claim */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl font-carter">
            QRTech se adapta a tu billetera.
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Elegí el medio que te quede mejor. Aceptamos tarjetas, billeteras y planes de financiación.
          </p>

          <div className="mt-6">
            <p className="text-lg sm:text-xl font-medium opacity-90">Podés pagar hasta</p>
            <p className="text-7xl sm:text-8xl font-black drop-shadow-xl text-indigo-400 tabular-nums">
              {cuotas}
            </p>
            <p className="text-2xl font-semibold tracking-wider">CUOTAS FIJAS</p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/80" />
              Garantía QRTech escrita
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/80" />
              Retiro en oficina (con cita)
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/80" />
              Combiná cualquier medio de pago
            </li>
          </ul>
        </motion.div>

        {/* Logos / tarjetas */}
        <motion.div
          className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* Glow suave */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ boxShadow: "0 0 80px 10px rgba(99,102,241,0.08) inset" }}
          />

          <h3 className="text-xl font-semibold mb-6 text-center">Elegí tu forma de pago</h3>

          <div className="grid grid-cols-3 gap-4 place-items-center">
            {logos.map((logo, i) => (
              <motion.div
                key={i}
                variants={logoVariants}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                className="w-20 sm:w-24 h-16 sm:h-20 rounded-xl flex items-center justify-center
                           bg-white/5 border border-white/10 hover:border-indigo-400/40
                           transition-colors duration-300"
                role="img"
                aria-label={logo.alt}
                title={logo.alt}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-14 sm:w-16 h-auto object-contain transition duration-300 opacity-95 hover:opacity-100 drop-shadow"

                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-300 flex justify-center items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/70" />
            <span>QRTech</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
