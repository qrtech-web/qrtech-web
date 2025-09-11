// src/components/ProductoCard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";
import { ShieldCheck, Store } from "lucide-react";

// SKU robusto si no viene en el objeto
const slug = (s = "") =>
  s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]+/g, "").slice(0, 24);

function buildWhatsAppHref({ baseWa, nombre, precioUsd }) {
  const utm = "utm_source=qrtech-web&utm_medium=card&utm_campaign=wa_product";
  const text = `Hola QRTech! Me interesa ${nombre}. Precio: ${precioUsd} USD. ${utm}`;
  const enc = encodeURIComponent(text);

  if (baseWa && baseWa.trim()) {
    if (baseWa.includes("text=")) return baseWa;
    const sep = baseWa.includes("?") ? "&" : "?";
    return `${baseWa}${sep}text=${enc}`;
  }
  return `https://wa.me/${WHATSAPP_PHONE}?text=${enc}`;
}

export default function ProductoCard({ producto }) {
  const nav = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  // Campos tal como los usabas antes
  const nombre = producto?.nombre ?? "Producto";
  const precioUsd = Number(producto?.precioUsd ?? 0);
  const imagen = producto?.imagen ?? "";
  const wa = producto?.wa ?? "";
  const sku = producto?.sku ?? producto?.id ?? slug(nombre);

  const href = buildWhatsAppHref({ baseWa: wa, nombre, precioUsd });

  const goToCalc = () => {
    try {
      sessionStorage.setItem(
        "qrtech:lastProduct",
        JSON.stringify({ sku, nombre, precio: precioUsd, imagen, wa: href })
      );
    } catch {}
    nav(`/calculadora?sku=${encodeURIComponent(sku)}`, {
      state: { sku, nombre, precio: precioUsd, imagen, wa: href },
    });
  };

  // accesibilidad: Enter/Space activan la card
  useEffect(() => {
    setImgLoaded(false);
  }, [imagen]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="cursor-pointer"
      onClick={(e) => {
        // si se clickea el <a>, no interceptar
        if ((e.target.tagName || "").toLowerCase() !== "a") goToCalc();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToCalc(); }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Ver cuotas de ${nombre}`}
    >
      {/* Borde degradado + contenedor glass */}
      <div className="p-[1px] rounded-2xl bg-gradient-to-br from-white/15 via-blue-500/20 to-cyan-400/20">
        <div className="rounded-2xl bg-white/5 backdrop-blur-md p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
          {/* FOTO con skeleton */}
          <div className="relative w-full aspect-[1/1] overflow-hidden rounded-xl">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            )}
            <LazyLoadImage
              src={imagen}
              alt={nombre}
              effect="blur"
              afterLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ${imgLoaded ? "group-hover:scale-105" : ""}`}
            />
          </div>

          {/* Título */}
          <h3 className="mt-4 text-2xl md:text-3xl font-carter text-white text-center">
            {nombre}
          </h3>

          {/* Chips de confianza */}
          <div className="mt-2 flex items-center justify-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-1">
              <ShieldCheck className="w-3 h-3" /> Garantía escrita
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 text-sky-300 px-2 py-1">
              <Store className="w-3 h-3" /> Retiro en oficina
            </span>
          </div>

          {/* Precio */}
          <p className="mt-3 text-center">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-blue-300 text-lg font-semibold">
              ${precioUsd} USD
            </span>
          </p>

          {/* Botones */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              className="text-xs btn transition duration-500 ease-in-out bg-blue-600 hover:bg-red-600 transform hover:-translate-y-1 hover:scale-110 relative z-[2]"
              onClick={(e) => { e.stopPropagation(); goToCalc(); }}
            >
              Calcular cuotas
            </button>

            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                trackWhatsAppClick({ name: nombre, priceUsd: precioUsd, location: "card" });
              }}
              className="btn text-xs transition duration-500 ease-in-out bg-green-600 hover:bg-green-700 transform hover:-translate-y-1 hover:scale-110 relative z-[1]"
            >
              Comprar
            </a>
          </div>

          <p className="mt-2 text-[10px] text-center text-white/50">
            Valores orientativos. Confirmamos por WhatsApp.
          </p>
        </div>
      </div>
    </motion.article>
  );
}
