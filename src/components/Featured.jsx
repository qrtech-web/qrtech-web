// src/components/Featured.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/productos.json';
import { WHATSAPP_PHONE } from '../config/whatsapp';
import { trackWhatsAppClick } from '../lib/track';

// Elegí qué 3 productos destacar
const FEATURED_IDS = ['ip16', 'ip13', 'ip12'];

// Precio "desde": mínimo entre variantes o base
function priceFrom(p) {
  if (Array.isArray(p?.variantes) && p.variantes.length) {
    const nums = p.variantes.map(v => Number(v?.precioUsd)).filter(Number.isFinite);
    const min = Math.min(...nums);
    return Number.isFinite(min) ? min : Number(p?.precioUsd || 0);
  }
  return Number(p?.precioUsd || 0);
}

export default function Featured() {
  const items = useMemo(
    () => FEATURED_IDS.map(id => data.find(p => p.id === id)).filter(Boolean),
    []
  );

  return (
    <section
      className="py-20 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white"
      aria-label="Top 3 productos destacados"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-carter text-center mb-12">
        Top <span className="text-indigo-400 font-bold">3 DESTACADOS </span> 2025
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl">
        {items.map((p, i) => {
          const desde = priceFrom(p);

          const vDesc = p.variantes?.length
            ? (() => {
                const v = p.variantes.slice().sort((a, b) => (a.precioUsd ?? 1e9) - (b.precioUsd ?? 1e9))[0];
                return [
                  v?.storage && `• ${v.storage}`,
                  v?.condicion && `• ${v.condicion}`,
                  v?.bateria && `• Batería ${v.bateria}`,
                ].filter(Boolean).join(' ');
              })()
            : '';

          const pdpHref  = `/productos?sku=${encodeURIComponent(p.id)}`;
          const calcHref = `/calculadora?sku=${encodeURIComponent(p.id)}&price=${encodeURIComponent(desde)}&v=${encodeURIComponent(vDesc)}`;
          const waText   = encodeURIComponent(
            [
              '¡Hola QRTech! 👋',
              `Quiero consultar por: ${p.nombre}`,
              vDesc || null,
              `• Precio desde USD ${desde}`,
              'utm_source=qrtech-web&utm_medium=featured&utm_campaign=wa_product',
            ].filter(Boolean).join('\n')
          );
          const waHref = `https://wa.me/${WHATSAPP_PHONE}?text=${waText}`;

          return (
            <article
              key={p.id}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition shadow-sm hover:shadow-lg overflow-hidden"
            >
              {/* Imagen: ratio 4:5 + gradiente + overlay marca */}
              <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-slate-900 to-slate-950">
                {/* Marca (fuera de la imagen, overlay sutil) */}
                <div className="absolute top-3 left-3 z-10 text-xs tracking-wide text-white/80">
                  <span className="font-medium">Apple</span>
                  <span className="mx-2 text-white/50">|</span>
                  <span className="font-carter">QRTech</span>
                </div>

                <Link to={pdpHref} className="block h-full w-full">
                  <img
                    src={p.imagen || '/img/placeholder.png'}
                    alt={p.nombre}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
                    // Cropping suave para ocultar el marco blanco del PNG
                    style={{ clipPath: 'inset(10px)' }}
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  />
                </Link>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <Link to={pdpHref} className="block">
                  <h3 className="text-[17px] md:text-lg font-semibold leading-tight">{p.nombre}</h3>
                </Link>
                <p className="mt-1 text-[13px] text-white/70">Con garantía · Retiro con cita</p>

                <div className="mt-3">
                  <div className="text-[13px] opacity-70">Desde</div>
                  <div className="text-xl md:text-2xl font-extrabold tracking-tight">USD {desde}</div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2.5 text-[14px] font-semibold text-white"
                    onClick={() => {
                      try {
                        trackWhatsAppClick?.({ name: p.nombre, priceUsd: desde, location: 'featured' });
                      } catch {}
                      try {
                        window.fbq?.('track', 'Lead', {
                          content_ids: [p.catalogId || p.id],
                          content_type: 'product',
                        });
                      } catch {}
                    }}
                    aria-label={`Consultar ${p.nombre} por WhatsApp`}
                  >
                    WhatsApp
                  </a>

                  <Link
                    to={calcHref}
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2.5 text-[14px] font-semibold border border-white/10"
                    aria-label={`Ver cuotas de ${p.nombre}`}
                  >
                    Ver cuotas
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
