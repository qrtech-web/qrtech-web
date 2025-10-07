// src/components/ComoComprar.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  DevicePhoneMobileIcon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathRoundedSquareIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";

const fade = { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: { duration: 0.45 } };

function buildWaHref(text, utm = "utm_source=qrtech-web&utm_medium=section&utm_campaign=como-comprar") {
  const enc = encodeURIComponent(`${text}\n`);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${enc}`;
}

export default function ComoComprar() {
  // --- PLAN CANJE (mini-wizard) ---
  const [modelo, setModelo] = useState("");
  const [estado, setEstado] = useState("Excelente");
  const [observ, setObserv] = useState("");
  const [interes, setInteres] = useState("");

  const waCanjeHref = useMemo(() => {
    const msg =
      `Hola QRTech! Quiero cotizar un *Plan Canje*.\n` +
      `• Modelo actual: ${modelo || "(sin especificar)"}\n` +
      `• Estado: ${estado}\n` +
      (observ ? `• Comentarios: ${observ}\n` : "") +
      `¿Me pueden decir el aproximado y qué necesito llevar?`;
    return buildWaHref(msg, "utm_source=qrtech-web&utm_medium=plan-canje&utm_campaign=wa_canje");
  }, [modelo, estado, observ]);

  const onCanjeSubmit = (e) => {
    e.preventDefault();
    try {
      trackWhatsAppClick({ name: "PlanCanje", priceUsd: 0, category: "plan-canje", location: "plan-canje" });
    } catch (_) {}
    window.open(waCanjeHref, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="como-comprar"
      className="relative py-16 lg:py-20 bg-gray-950 text-gray-100 scroll-mt-24 md:scroll-mt-32"
      aria-labelledby="title-como-comprar"
    >
      {/* título */}
      <motion.div {...fade} className="max-w-5xl mx-auto px-6 text-center">
        <h2 id="title-como-comprar" className="text-3xl lg:text-4xl font-bold tracking-tight">
          ¿Cómo comprar en QRTech?
        </h2>
        <p className="mt-3 text-gray-300">
          Simple y rápido: elegís tu articulo, simulás cuotas y coordinás retiro en nuestra oficina.
        </p>
      </motion.div>

      {/* 3 pasos */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <motion.div {...fade} className="group rounded-2xl border border-white/10 bg-gray-900/40 p-6 hover:border-white/20 hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center">
              <DevicePhoneMobileIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">1) Elegí tu modelo</h3>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Entrá al <a href="/productos" className="underline underline-offset-2 hover:text-white">catálogo</a>,
            filtrá por categoría y abrí la ficha para ver garantías y estado.
          </p>
          <a
            href="/productos"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Ver catálogo
          </a>
        </motion.div>

        <motion.div {...fade} className="group rounded-2xl border border-white/10 bg-gray-900/40 p-6 hover:border-white/20 hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center">
              <CalculatorIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">2) Simulá tus cuotas</h3>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Usá la <a href="/calculadora" className="underline underline-offset-2 hover:text-white">Calculadora</a> para ver 1, 3, 6, 9 y 12 cuotas estimadas.
          </p>
          <a
            href="/calculadora"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Abrir Calculadora
          </a>
        </motion.div>

        <motion.div {...fade} className="group rounded-2xl border border-white/10 bg-gray-900/40 p-6 hover:border-white/20 hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">3) Coordiná por WhatsApp</h3>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Confirmamos stock, coordinamos tu cita en <b>San Lorenzo 987</b> y retirás con garantía escrita.
          </p>
          <a
            href={buildWaHref("Hola QRTech! Quiero coordinar mi compra y retiro en oficina.")}
            onClick={() => { try { trackWhatsAppClick({ name: "CTA ComoComprar", priceUsd: 0, location: "como-comprar" }); } catch {} }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-green-600/90 hover:bg-green-600 transition"
          >
            Abrir WhatsApp
          </a>
        </motion.div>
      </div>

      {/* divisor */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px w-full my-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* PLAN CANJE */}
<div
  id="plan-canje"
  className="max-w-6xl mx-auto px-6 scroll-mt-24 md:scroll-mt-32"
  aria-labelledby="title-plan-canje"
>
  <motion.div {...fade} className="flex items-start gap-3 mb-4">
    <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center">
      <ArrowPathRoundedSquareIcon className="h-6 w-6" />
    </div>
    <div>
      <h3 id="title-plan-canje" className="text-xl font-semibold">Plan Canje</h3>
      <p className="text-gray-300 text-sm">
        Traé tu equipo usado y pagá menos. Estimamos el valor en minutos.
      </p>
    </div>
  </motion.div>

  <motion.form
    {...fade}
    onSubmit={onCanjeSubmit}
    className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-gray-900/40 p-6"
  >
    {/* Modelo actual */}
    <label className="text-sm">
      <span className="block text-gray-300 mb-1">Modelo actual</span>
      <input
        value={modelo}
        onChange={(e) => setModelo(e.target.value)}
        placeholder="iPhone 12, 128 GB"
        className="w-full rounded-lg bg-gray-800/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
      />
    </label>

    {/* Estado */}
    <label className="text-sm">
      <span className="block text-gray-300 mb-1">Estado</span>
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="w-full rounded-lg bg-gray-800/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
      >
        <option>Excelente</option>
        <option>Muy bueno</option>
        <option>Bueno</option>
        <option>Con detalles</option>
        <option>No prende</option>
      </select>
    </label>

    {/* Celular de interés */}
    <label className="md:col-span-3 text-sm">
      <span className="block text-gray-300 mb-1">Celular de interés</span>
      <input
        value={interes}
        onChange={(e) => setInteres(e.target.value)}
        placeholder="Ej: iPhone 15 Pro, 256 GB"
        className="w-full rounded-lg bg-gray-800/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
      />
    </label>

    {/* Comentarios */}
    <label className="md:col-span-3 text-sm">
      <span className="block text-gray-300 mb-1">Comentarios (opcional)</span>
      <div className="relative">
        <ClipboardDocumentListIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          value={observ}
          onChange={(e) => setObserv(e.target.value)}
          placeholder="Incluí detalles o accesorios..."
          className="w-full rounded-lg bg-gray-800/70 border border-white/10 pl-10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Tip: cuando se abra WhatsApp podés adjuntar fotos del equipo para una mejor estimación.
      </p>
    </label>

    {/* Botones */}
    <div className="md:col-span-3 flex items-center gap-3 pt-2">
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/90 hover:bg-green-600 transition"
        aria-label="Enviar Plan Canje por WhatsApp"
      >
        Enviar por WhatsApp
      </button>
      <a
        href="/productos"
        className="text-sm underline underline-offset-2 hover:text-white"
      >
        Ver catálogo
      </a>
    </div>
  </motion.form>
</div>
    </section>
  );
}
