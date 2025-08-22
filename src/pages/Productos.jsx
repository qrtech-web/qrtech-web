// src/pages/Productos.jsx
import productos from "../data/productos.json"           // ← import local
import ProductoCard from "../components/ProductoCard"
import { motion } from "framer-motion";

export default function Productos () {
  return (
    
      <motion.div className="min-h-screen pt-24 pb-16 bg-black text-text">
        <section id="catalogo" className="py-24  text-white">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading principal */}
          <h2
            className="relative text-center font-carter font-black
                      text-4xl sm:text-5xl lg:text-7xl mb-6 leading-tight"
            data-aos="fade-down"
          >
            Catálogo
            {/* Decorador under-line */}
            <span
              className="absolute left-1/2 -bottom-4 -translate-x-1/2
                        block h-1 w-40 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500
                        rounded-full"
            />
          </h2>

            {/* Sub-heading opcional */}
            <p
              className="mx-auto max-w-xl text-center text-soft-text text-sm sm:text-base mb-5"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              Explorá nuestro stock de iPhone con disponibilidad inmediata.
              Elegí tu equipo y calculá tus cuotas al instante.
            </p>
    
            {/* grilla responsiva */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
                data-aos="zoom-in" data-aos-delay="100">
              {productos.map(p => <ProductoCard key={p.id} producto={p}/>)}
            </div>
          </div>
        </section>
        </motion.div>
    
  )
}
