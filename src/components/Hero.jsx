// src/components/Hero.jsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

export default function Hero() {
  return (
    // isolate crea un stacking context propio; w-screen evita franjas a los lados
    <header className="relative isolate w-screen max-w-none overflow-hidden bg-[#0b0f19] min-h-[calc(100svh-56px)] md:min-h-[calc(100svh-64px)]">
      {/* Capa de fondo (no intercepta clics) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/60" />
      </div>

      {/* Contenido (habilitado para clics y por encima de todo) */}
      <div className="relative z-[30] max-w-7xl mx-auto px-6 lg:px-10 pt-10 md:pt-14 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center font-carter tracking-tight text-4xl sm:text-5xl md:text-6xl text-white"
        >
          Experiencia <span className="text-indigo-400">QR</span> sin límites
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-3 text-center text-gray-300 text-base sm:text-lg"
        >
          Stock inmediato · San Miguel de Tucumán.
        </motion.p>

        <div className="flex justify-center">
          <MotionLink
            to="/productos"
            aria-label="Ir al catálogo"
            // z-altísimo y pointer-events explícitos para ganar a cualquier overlay vecino
            className="relative z-[99] mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 text-lg font-medium shadow-lg pointer-events-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.04 }}
          >
            Ver catálogo <ArrowRight size={20} />
          </MotionLink>
        </div>
      </div>

      {/* Colchón inferior sin capturar clics: evita que la sección siguiente pise el CTA */}
      <div className="absolute inset-x-0 bottom-0 h-4 pointer-events-none" />
    </header>
  );
}
