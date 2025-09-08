// src/pages/Productos.jsx
import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import data from '../data/productos.json';
import TrustBadges from '../components/TrustBadges';
import Filters from '../components/Filters';

function useQuery(){ return new URLSearchParams(useLocation().search); }

function trackViewContent(prod){
  try{
    if(!window.fbq || !prod) return;
    const catalogId = prod.catalogId || prod.id; // <= CLAVE: debe MATCHEAR ID del catálogo
    window.fbq('track', 'ViewContent', {
      content_ids: [catalogId],
      content_type: 'product',
      content_name: prod.nombre,
      contents: [{ id: catalogId, quantity: 1, item_price: prod.precioUsd }],
      value: prod.precioUsd, // ok si usás USD; no afecta el match
      currency: 'USD'
    });
    // console.debug('VC sent', { catalogId });
  }catch(e){ /* console.error(e); */ }
}

// 1) Agregá esta función arriba del export (debajo de imports)
function trackViewContent(prod){
  try{
    if(!window.fbq || !prod) return;
    const catalogId = prod.catalogId || prod.id; // CLAVE: match con catálogo
    window.fbq('track', 'ViewContent', {
      content_ids: [catalogId],
      content_type: 'product',
      content_name: prod.nombre,
      contents: [{ id: catalogId, quantity: 1, item_price: prod.precioUsd }],
      value: prod.precioUsd,
      currency: 'USD'
    });
  }catch(_e){}
}



export default function Productos(){
  const query = useQuery();
  const sku   = query.get('sku');
  const q     = query.get('q') || '';
  const [search, setSearch] = useState(q);

  const seleccionado = useMemo(() => data.find(p => p.id === sku), [sku]);

  const filtrados = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if(!needle) return data;
    return data.filter(p => p.nombre.toLowerCase().includes(needle));
  }, [search]);

  useEffect(() => {
  if (seleccionado) trackViewContent(seleccionado);
}, [seleccionado]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold font-carter text-center">Nuestros Productos</h1>
      <TrustBadges />
      <Filters query={search} onChange={setSearch} />

      {seleccionado && (
        <article className="mt-8 grid gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 md:grid-cols-2" aria-label={`Detalle de ${seleccionado.nombre}`}>
          <div>
            <img src={seleccionado.imagen} alt={`Foto ${seleccionado.nombre}`} loading="lazy" className="w-full rounded-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{seleccionado.nombre}</h2>
            <p className="mt-2 text-lg">Desde <strong>{seleccionado.precioUsd} USD</strong></p>
            <p className="mt-1 text-sm opacity-80">Garantía QRTech escrita · Retiro en San Lorenzo 987</p>
            <div className="mt-4 flex gap-3">
              <a
                href={seleccionado.wa || `https://wa.me/5493815677391?text=${encodeURIComponent('¡Hola QRTech! Quiero el ' + seleccionado.nombre + ' (' + (seleccionado.catalogId || seleccionado.id) + ')')}`}
                target="_blank" rel="noopener noreferrer"
                className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white"
                onClick={() => {
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_ids: [ (seleccionado?.catalogId || seleccionado?.id) ],
      content_type: 'product'
    });
  }
}}
                aria-label={`Consultar ${seleccionado.nombre} por WhatsApp`}
              >
                Consultar por WhatsApp
              </a>
              <Link to={`/calculadora?sku=${seleccionado.id}`} className="rounded-xl bg-white/10 px-4 py-3 font-semibold">
                Ver cuotas
              </Link>
            </div>
          </div>
        </article>
      )}

      <section className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtrados.map((p) => (
          <article key={p.id} className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <Link to={`/productos?sku=${p.id}`} className="block">
              <img src={p.imagen} alt={`Foto ${p.nombre}`} loading="lazy" className="w-full rounded-xl" />
              <h3 className="mt-3 text-lg font-semibold">{p.nombre}</h3>
              <p className="opacity-80">Desde {p.precioUsd} USD</p>
            </Link>
            <div className="mt-3">
              <a
                href={p.wa || `https://wa.me/5493815677391?text=${encodeURIComponent('¡Hola QRTech! Quiero el ' + p.nombre + ' (' + (p.catalogId || p.id) + ')')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                // 4) (Opcional) En las cards del listado, lo mismo:
onClick={() => {
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_ids: [ (p.catalogId || p.id) ],
      content_type: 'product'
    });
  }
}}

                aria-label={`Consultar ${p.nombre} por WhatsApp`}
              >
                Consultar por WhatsApp
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
