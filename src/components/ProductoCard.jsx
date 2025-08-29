// src/components/ProductoCard.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ProductoCard({ producto }) {
  const nav = useNavigate();
  const { nombre, precioUsd, imagen, wa } = producto;

  return (
    <motion.article
      className="group bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-lg hover:shadow-2xl  
                 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* FOTO — ahora flex-grow para ocupar la mayor parte */}
      <div className="flex-1 flex items-center justify-center ">
        <div className="w-full aspect-[1/1] overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-105">
          <LazyLoadImage
            src={imagen}
            alt={nombre}
            effect="blur"
            className="w-full h-full object-cover "
          />
        </div>
      </div>

      {/* INFO */}
      <h3 className="mt-4 text-3xl font-carter text-white text-center">{nombre}</h3>
      <p className=" text-center text-2xl text-blue-300">${precioUsd} USD</p>

     
      {/* BOTONES */}
  <div className="grid grid-cols-2 gap-3 mt-6">
  <button
    type="button"
    rel="noreferrer"
    className="text-xs btn transition duration-500 ease-in-out bg-blue-600 hover:bg-red-600 transform hover:-translate-y-1 hover:scale-110 relative z-[2]
    "   // 👈 más alto
    onClick={() =>
   nav("/calculadora", {
     state: { precio: precioUsd, nombre, imagen, wa },
   })}
  >
    Calcular cuotas
  </button>

  <a
    href={wa}
    target="_blank"
    rel="noreferrer"
    className="btn text-xs transition duration-500 ease-in-out bg-blue-600 hover:bg-green-600 transform hover:-translate-y-1 hover:scale-110 relative z-[1]"   // 👈 debajo
  >
    Comprar
  </a>
</div>
    </motion.article>
  );
}
