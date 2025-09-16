// src/components/Hero.jsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

export default function Hero() {
  return (
    // Ocupa pantalla menos header (56px mobile / 64px desktop) y evita el hueco
    <header className="relative overflow-hidden bg-[#0b0f19] min-h-[calc(100svh-56px)] md:min-h-[calc(100svh-64px)]">
      {/* Video de fondo (opcional) */}
      <video
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        src="/media/hero-loop.mp4"
        poster="/media/hero-fallback.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Overlay para mejorar contraste del texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/60" />

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Espaciado superior justo */}
        <div className="pt-10 md:pt-14" />

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center font-display tracking-tight text-h1 text-white"
        >
          Experiencia <span className="text-indigo-400">QR</span> sin límites
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-3 text-center text-gray-300 text-base sm:text-lg"
        >
          Stock inmediato · Soporte certificado en Tucumán
        </motion.p>

        <div className="flex justify-center">
          <MotionLink
            to="/productos"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.04 }}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 text-lg font-medium shadow-lg"
          >
            Ver catálogo <ArrowRight size={20} />
          </MotionLink>
        </div>

        {/* Espaciado inferior responsable (evita que el CTA quede pegado al borde) */}
        <div className="pb-10 md:pb-14" />
      </div>
    </header>
  );
}
