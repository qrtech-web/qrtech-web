// src/components/FormasDePago.jsx
import React from "react";
import { motion } from "framer-motion";

const methods = [
  {
    key: "visa",
    label: "Visa",
    img: "/img/payments/visa.svg",
    note: "Crédito y débito",
  },
  {
    key: "mastercard",
    label: "Mastercard",
    img: "/img/payments/mastercard.svg",
    note: "Crédito y débito",
  },
  {
    key: "amex",
    label: "American Express",
    img: "/img/payments/amex.svg",
    note: "Crédito",
  },
  {
    key: "mp",
    label: "Mercado Pago",
    img: "/img/payments/mercado-pago.svg",
    note: "Cuotas y QR",
  },
  {
    key: "transfer",
    label: "Transferencia",
    img: "/img/payments/transferencia.svg",
    note: "Descuento por pago",
  },
  {
    key: "cash",
    label: "Efectivo",
    img: "/img/payments/efectivo.svg",
    note: "En oficina",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, delay: 0.05 + i * 0.05 },
  }),
};

export default function FormasDePago() {
  return (
    <section
      aria-labelledby="formas-pago-title"
      className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-6"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2
            id="formas-pago-title"
            className="text-xl md:text-2xl font-semibold tracking-tight"
          >
            Formas de pago
          </h2>
          <p className="text-sm opacity-75 mt-1">
            Aceptamos tarjetas, QR y transferencias. Consultá cuotas disponibles.
          </p>
        </div>
        <div className="text-xs opacity-70">
          <span className="inline-block px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-400/30">
            Garantía de 90 días.
          </span>
        </div>
      </div>

      {/* Grid responsivo de métodos */}
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {methods.map((m, i) => (
          <motion.li
            key={m.key}
            custom={i}
            variants={cardVariants}
            className="group relative rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
          >
            <button
              type="button"
              className="w-full h-full text-left p-3 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-xl"
              aria-label={m.label}
              tabIndex={0}
            >
              <div className="h-9 w-12 flex items-center justify-center rounded-lg bg-white">
                {/* Logo a color. Si no carga, mostramos iniciales */}
                <img
                  src={m.img}
                  alt={m.label}
                  className="h-6 w-auto"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.replaceWith(
                      Object.assign(document.createElement("div"), {
                        className: "h-6 w-10 flex items-center justify-center text-[11px] font-semibold text-slate-700",
                        innerText: m.label.slice(0, 3).toUpperCase(),
                      })
                    );
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold leading-tight">
                  {m.label}
                </div>
                <div className="text-xs opacity-70 truncate">{m.note}</div>
              </div>
              {/* micro-animación: “tilt” */}
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="h-4 w-4 rotate-0 group-hover:-rotate-6 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      {/* Aviso legal corto */}
      <p className="mt-4 text-xs opacity-60">
        Los medios y planes pueden variar según disponibilidad. Las cuotas y costos
        financieros los define cada entidad/servicio al momento del pago.
      </p>
    </section>
  );
}
