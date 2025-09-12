// src/components/ProductoCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";
import { ShieldCheck, Store } from "lucide-react";

// Normaliza un texto para usar como SKU fallback
const slug = (s = "") =>
  s.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "").slice(0, 24);

function buildWhatsAppHref({ baseWa, nombre, precioUsd }) {
  if (baseWa) return baseWa;
  const msg = encodeURIComponent(
    `¡Hola QRTech! Quiero el ${nombre}.\nPrecio USD: ${precioUsd}\n\nutm_source=qrtech-web&utm_medium=card&utm_campaign=wa_catalog`
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
}

export default function ProductoCard({ producto }) {
  const nav = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  const nombre = producto?.nombre ?? "Producto";
  const precioUsd = Number(producto?.precioUsd ?? 0);
  const imagen = producto?.imagen ?? "";
  const wa = producto?.wa ?? "";
  const sku = producto?.id ?? producto?.sku ?? slug(nombre);

  const href = buildWhatsAppHref({ baseWa: wa, nombre, precioUsd });

  const goToDetail = () => {
    nav(`/productos?sku=${encodeURIComponent(sku)}`);
  };

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

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className="group relative rounded-2xl border border-white/10 bg-gray-900/50 hover:border-white/20 hover:shadow-xl hover:shadow-black/30 overflow-hidden cursor-pointer"
      role="listitem"
      aria-label={nombre}
      onClick={goToDetail}
    >
      {/* halo sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
        <div className="absolute inset-x-0 -bottom-16 h-32 blur-2xl bg-gradient-to-t from-white/10 to-transparent" />
      </div>

      {/* imagen */}
      <div className="relative">
        {!imgLoaded && (
          <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 to-white/10" />
        )}
        <LazyLoadImage
          src={imagen}
          alt={nombre}
          effect="blur"
          afterLoad={() => setImgLoaded(true)}
          wrapperClassName="block"
          className="w-full aspect-[1/1] object-contain p-6"
          width="512"
          height="512"
        />
      </div>

      <div className="px-4 pb-4">
        {/* Título */}
        <h3 className="mt-1 text-xl md:text-2xl font-carter text-white text-center">
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
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mt-5">
          {/* Ver más (detalle) */}
          

          {/* Calculadora */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goToCalc(); }}
            className="text-xs rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 transition"
            aria-label="Calcular cuotas"
          >
            Calcular cuotas
          </button>

          {/* Comprar */}
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              trackWhatsAppClick({
                name: nombre,
                priceUsd: precioUsd,
                category: "iphone",
                location: "card",
              });
            }}
            className="text-xs rounded-lg bg-green-600/90 hover:bg-green-600 px-3 py-2 transition inline-flex items-center justify-center"
            aria-label="Comprar por WhatsApp"
          >
            Comprar
          </a>
        </div>

        <p className="mt-2 text-[10px] text-center text-white/50">
          Valores orientativos. Confirmamos por WhatsApp.
        </p>
      </div>
    </motion.article>
  );
}
