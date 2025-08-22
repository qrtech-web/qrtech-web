// src/components/FormasDePago.jsx
import { motion } from "framer-motion";

const logos = [
  { src: "/logos/visa.jpg", alt: "Visa" },
  { src: "/logos/mastercard.png", alt: "Mastercard" },
  { src: "/logos/mercado.png", alt: "Mercado Pago" },
  { src: "/logos/amex.png", alt: "American Express" },
  { src: "/logos/sucredito.png", alt: "Sucrédito" },
  { src: "/logos/nx.png", alt: "NX" },
  { src: "/logos/plan-canje.png", alt: "Plan Canje" },
];

export default function FormasDePago() {
  return (
    <section
      className="relative py-24 px-4 text-white"
      style={{
        backgroundImage: "url('/fondos/formas-pago-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Texto principal */}
        <div className="space-y-6 text-center md:text-left">
          <motion.h2
            className="text-3xl sm:text-4xl font-carter leading-tight"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            QRTech se adapta a tu billetera.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg sm:text-xl font-medium">Podes pagar hasta</p>
            <p className="text-7xl sm:text-8xl font-black drop-shadow-xl text-indigo-400">12</p>
            <p className="text-2xl font-semibold tracking-wider">CUOTAS FIJAS</p>
          </motion.div>
        </div>

        {/* Logos / tarjetas */}
        <motion.div
          className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl sm:text-2xl font-carter text-center mb-6">
            Elegí tu forma de pago
          </h3>

          <div className="grid grid-cols-3 gap-4 place-items-center">
            {logos.map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="w-16 sm:w-20 h-auto object-contain"
                loading="lazy"
              />
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-300 flex justify-center items-center gap-2">
            
            <span>QRTech</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
