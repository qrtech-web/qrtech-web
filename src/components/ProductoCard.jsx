// src/components/ProductoCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";

/**
 * Tarjeta optimizada para mobile (grid 2):
 * - Tipografías +12% vs antes
 * - Área de imagen estable (aspect-square) y más grande
 * - CTA grandes y fáciles de tocar (alto 40px)
 * - Layout compacto para que 2 cards respiren bien
 */
export default function ProductoCard({ producto }) {
  if (!producto) return null;
  const { id, nombre, precioUsd, imagen } = producto;

  const waText = encodeURIComponent(
    `¡Hola QRTech! Quiero consultar por: ${nombre}\n• ${precioUsd} USD\n\nutm_source=qrtech-web&utm_medium=catalogo_card&utm_campaign=wa_product`
  );
  const waHref = `https://wa.me/${WHATSAPP_PHONE}?text=${waText}`;

  return (
    <article
      className="group rounded-2xl border border-white/10 bg-white/[0.04] shadow-sm hover:shadow-md transition overflow-hidden"
      aria-label={nombre}
    >
      {/* Imagen (cuadrada, grande y centrada) */}
      <Link
        to={`/productos?sku=${encodeURIComponent(id)}`}
        onClick={() => {
          try {
            sessionStorage.setItem(
              "qrtech:lastProduct",
              JSON.stringify({ id, nombre, precio: precioUsd, imagen })
            );
          } catch {}
        }}
        className="block bg-white/3"
      >
        <div className="relative aspect-square w-full p-3">
          <div className="absolute inset-0 rounded-xl bg-white/5 border border-white/10" />
          <img
            loading="lazy"
            src={imagen || "/img/placeholder.png"}
            alt={nombre}
            className="relative z-[1] h-full w-full object-contain p-2"
          />
        </div>
      </Link>

      {/* Cuerpo */}
      <div className="px-3.5 pb-3.5 pt-1">
        {/* Nombre (2 líneas máximo sin plugin, con alto fijo) */}
        <Link
          to={`/productos?sku=${encodeURIComponent(id)}`}
          className="block min-h-[44px] text-[15px] font-semibold leading-snug text-gray-100 hover:text-white"
        >
          {nombre}
        </Link>

        {/* Badges mini */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] opacity-80">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 text-emerald-300 px-2 py-[2px]">
            ✓ Garantía
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/12 text-sky-300 px-2 py-[2px]">
            📍 Retiro
          </span>
        </div>

        {/* Precio */}
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[15px] font-extrabold text-emerald-300">
            ${Number(precioUsd || 0).toLocaleString("en-US")} USD
          </span>
        </div>

        {/* CTAs (tamaño táctil) */}
        <div className="mt-2 grid grid-cols-1 gap-2">
          <Link
            to={`/calculadora?sku=${encodeURIComponent(id)}`}
            state={{ sku: id, nombre, precio: precioUsd, imagen }}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/8 hover:bg-white/12 text-[13px] font-semibold"
            aria-label={`Calcular cuotas de ${nombre}`}
          >
            Calcular cuotas
          </Link>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ name: nombre, priceUsd: precioUsd, location: "card" })}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold"
            aria-label={`Consultar ${nombre} por WhatsApp`}
          >
            Comprar
          </a>
        </div>
      </div>
    </article>
  );
}
