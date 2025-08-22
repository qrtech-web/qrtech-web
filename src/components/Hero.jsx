// src/components/Hero.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <header className="relative h-screen overflow-hidden bg-dark-bg">
      <video
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        src="/media/hero-loop.mp4"
        poster="/media/hero-fallback.jpg"
        autoPlay muted loop playsInline aria-hidden="true"
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          Experiencia <span className="text-primary">Apple</span> sin límites
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-soft-text mb-8"
        >
          Stock inmediato · Soporte certificado en Tucumán
        </motion.p>

        <div className="flex items-center gap-6">
          <motion.a
            href="productos"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Ver catálogo <ArrowRight size={20} />
          </motion.a>

          
        </div>
      </div>
    </header>
  );
}
