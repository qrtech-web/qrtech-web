// src/components/Faq.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.45 },
};

const faqs = [
  {
    q: "¿Los iPhone son usados? ¿Qué incluyen?",
    a: (
      <>
        Son <b>usados premium</b> verificados. Incluyen <b>garantía escrita</b>, cable compatible y
        prueba en nuestra oficina antes de retirar. Accesorios extra (cargadores, fundas, etc.) se pueden agregar aparte.
      </>
    ),
  },
  {
    q: "¿Cómo funciona la garantía?",
    a: (
      <>
        Entregamos <b>garantía QRTech</b> por escrito al retirar (cubre funcionamiento general del equipo, no daños por uso).
        Ante cualquier duda, nos contactás y coordinamos revisión. Más info en{" "}
        <a className="underline" href="/inicio#como-comprar">Cómo comprar</a>.
      </>
    ),
  },
  {
    q: "¿Puedo pagar en cuotas?",
    a: (
      <>
        Sí. Podés simular 1, 2, 3, 6, 9 y 12 cuotas en la{" "}
        <a className="underline" href="/calculadora">Calculadora</a>. Ahí verás total estimado y valor de cuota.
      </>
    ),
  },
  {
    q: "¿Hacen plan canje?",
    a: (
      <>
        Sí. Traés tu equipo usado y se descuenta del precio. Podés iniciar desde{" "}
        <a className="underline" href="/inicio#plan-canje">Plan canje</a> (mini formulario) y seguimos por WhatsApp.
      </>
    ),
  },
  {
    q: "¿Qué revisan antes de vender?",
    a: (
      <>
        Probamos <b>batería</b>, conectividad, cámaras, Face/Touch ID, parlantes, micrófono y botones.
        Si el equipo tuvo cambio de pantalla o batería, lo aclaramos.
      </>
    ),
  },
  {
    q: "¿Desbloqueo/iCloud?",
    a: (
      <>
        Todos los equipos se entregan <b>libres</b> y sin cuentas de iCloud. Te ayudamos a configurarlo en el momento.
      </>
    ),
  },
  {
    q: "¿Dónde y cómo retiro?",
    a: (
      <>
        Coordinamos día y horario y retirás en <b>San Lorenzo 987</b> (con cita). Confirmamos stock por WhatsApp.
      </>
    ),
  },
];

function WhatsAppCTA() {
  const text =
    "¡Hola QRTech! Tengo una consulta sobre la compra, garantía o plan canje.";
  const href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() =>
        trackWhatsAppClick({ name: "FAQ", priceUsd: 0, category: "info", location: "faq" })
      }
      className="inline-flex items-center gap-2 rounded-lg bg-green-600/90 hover:bg-green-600 px-4 py-2 font-medium"
    >
      Consultar por WhatsApp
    </a>
  );
}

export default function Faq() {
  return (
    <section
      id="faq"
      className="bg-gray-950 text-gray-100 py-16 lg:py-20 scroll-mt-24 md:scroll-mt-32"
      aria-labelledby="title-faq"
    >
      <motion.div {...fade} className="max-w-5xl mx-auto px-6 text-center">
        <h2 id="title-faq" className="text-3xl lg:text-4xl font-bold tracking-tight">
          Preguntas frecuentes
        </h2>
        <p className="mt-3 text-gray-300">
          Lo esencial sobre compra, garantía, cuotas y plan canje. Si te queda alguna duda, escribinos.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto mt-8 px-6">
        <ul className="space-y-3">
          {faqs.map((item, i) => (
            <li key={i}>
              <details className="group rounded-xl border border-white/10 bg-gray-900/40 p-4 open:bg-gray-900/60 transition">
                <summary className="flex items-center justify-between cursor-pointer select-none">
                  <span className="text-sm md:text-base font-medium">{item.q}</span>
                  <ChevronDownIcon className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-3 text-sm text-gray-300">{item.a}</div>
              </details>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-300">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-300" />
            <span>Garantía escrita y revisión al retirar</span>
          </div>
          <WhatsAppCTA />
        </div>
      </div>
    </section>
  );
}
