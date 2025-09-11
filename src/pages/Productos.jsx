// src/pages/Productos.jsx
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import data from '../data/productos.json';
import TrustBadges from '../components/TrustBadges';
import TiltCard from '../components/TiltCard';


function useQuery(){ return new URLSearchParams(useLocation().search); }

// Meta Pixel: ViewContent del producto seleccionado
function trackViewContent(prod){
  try{
    if(!window.fbq || !prod) return;
    const catalogId = prod.catalogId || prod.id;
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

// Chips de categorías visibles
const CHIPS = [
  { key: 'iphone', label: 'iPhone' },
  { key: 'ipad', label: 'iPad' },
  { key: 'mac', label: 'Mac' },
  { key: 'watch', label: 'Apple Watch' },
  { key: 'airpods', label: 'AirPods' },
  { key: 'android', label: 'Android' },
  { key: 'accesorios', label: 'Accesorios' },
];

// Deducción simple desde el nombre del producto
function guessCategory(p){
  const t = (p?.nombre || '').toLowerCase();
  if (t.includes('iphone')) return 'iphone';
  if (t.includes('ipad')) return 'ipad';
  if (t.includes('mac')) return 'mac';
  if (t.includes('watch') || t.includes('apple watch')) return 'watch';
  if (t.includes('airpods')) return 'airpods';
  if (t.includes('android') || t.includes('samsung') || t.includes('xiaomi') || t.includes('motorola')) return 'android';
  if (t.includes('cable') || t.includes('funda') || t.includes('cargador') || t.includes('accesorio')) return 'accesorios';
  return 'otros';
}

// Tamaño de página (cuántos ítems por “Cargar más”)
const PAGE_SIZE = 8;

export default function Productos(){
  const query = useQuery();
  const location = useLocation();
  const sku   = query.get('sku');

  // Búsqueda + categoría
  const [search, setSearch] = useState(query.get('q') || '');
  const [category, setCategory] = useState('all'); // 'all' | keys de CHIPS

  const seleccionado = useMemo(() => data.find(p => p.id === sku), [sku]);

  const filtrados = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return data.filter(p => {
      const okSearch = !needle || (p.nombre || '').toLowerCase().includes(needle);
      const okCat = category === 'all' || guessCategory(p) === category;
      return okSearch && okCat;
    });
  }, [search, category]);

  // Track del detalle
  useEffect(() => { if (seleccionado) trackViewContent(seleccionado); }, [seleccionado]);

  // Auto-scroll al detalle cuando cambia ?sku=...
  const refDetalle = useRef(null);
  const [highlight, setHighlight] = useState(false);
  useEffect(() => {
    if (!seleccionado || !refDetalle.current) return;
    const id = requestAnimationFrame(() => {
      const headerOffset = 90; // altura aprox. de tu navbar
      const rect = refDetalle.current.getBoundingClientRect();
      const top = window.scrollY + rect.top - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1200);
    });
    return () => cancelAnimationFrame(id);
  }, [seleccionado, location.key]);

  // Paginación “Cargar más”
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [search, category]); // reset al cambiar filtro/búsqueda
  const total = filtrados.length;
  const visibles = filtrados.slice(0, page * PAGE_SIZE);

  const categoryLabel = CHIPS.find(c => c.key === category)?.label;

  // Mostrar botón "Arriba" al hacer scroll
  const [showUp, setShowUp] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowUp(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* HERO con buscador grande + chips */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-carter">Encontrá tu próximo iPhone</h1>
        <p className="mt-2 opacity-80">Usados premium con garantía · Tucumán</p>

        <div className="mt-6 max-w-xl mx-auto">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar: iPhone 13 128, Pro Max, iPad, etc."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-3 md:p-4 text-base md:text-lg
                       focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/30 transition"
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1 rounded-full text-sm border ${category==='all' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            Todos
          </button>
          {CHIPS.map(ch => (
            <button
              key={ch.key}
              onClick={() => setCategory(ch.key)}
              className={[
                "px-3 py-1 rounded-full text-sm border",
                category===ch.key ? "bg-emerald-600/30 border-emerald-400/40 text-emerald-200" : "bg-white/5 border-white/10 hover:bg-white/10"
              ].join(' ')}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </section>

      <TrustBadges />

      {/* Subheader sticky con resultados */}
      <div className="sticky top-[70px] z-30 -mx-4 px-4 py-2 bg-slate-900/80 backdrop-blur border-b border-white/10 flex items-center justify-between mt-6">
        <span className="text-sm opacity-80">
          {category!=='all' ? `Categoría: ${categoryLabel} · ` : ''}{search ? `Resultados para “${search}”` : 'Todos los productos'}
        </span>
        <span className="text-sm opacity-70">{visibles.length}/{total}</span>
      </div>

      {seleccionado && (
        <article
          ref={refDetalle}
          className={[
            "mt-8 grid gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 md:grid-cols-2 transition-shadow",
            highlight ? "ring-2 ring-emerald-400 shadow-emerald-400/20 shadow-lg" : ""
          ].join(" ")}
          aria-label={`Detalle de ${seleccionado.nombre}`}
        >
          <div>
            <img
              src={seleccionado.imagen}
              alt={`Foto ${seleccionado.nombre}`}
              loading="lazy"
              className="w-full rounded-xl"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{seleccionado.nombre}</h2>
            <p className="mt-2 text-lg">Desde <strong>{seleccionado.precioUsd} USD</strong></p>
            <p className="mt-1 text-sm opacity-80">Garantía QRTech escrita · Retiro en San Lorenzo 987</p>
            <div className="mt-4 flex gap-3">
              <a
                href={seleccionado.wa || `https://wa.me/5493815677391?text=${encodeURIComponent('¡Hola QRTech! Quiero el ')}`}
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

      {/* GRID: 2 columnas en móviles, luego 3/4 – paginado */}
      <section className="mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {visibles.map((p) => (
            <TiltCard key={p.id} className="p-[1px] rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent">
  <div className="group rounded-2xl border border-white/15 bg-white/5 p-4 hover:shadow-2xl hover:-translate-y-0.5 transition">
    <Link to={`/productos?sku=${p.id}`} className="block">
      <div className="w-full overflow-hidden rounded-xl">
        <img
          src={p.imagen}
          alt={`Foto ${p.nombre}`}
          loading="lazy"
          className="w-full rounded-xl transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 text-lg font-semibold">{p.nombre}</h3>
      <p className="opacity-80">Desde {p.precioUsd} USD</p>
    </Link>

    <div className="mt-3">
      <a
        href={p.wa || `https://wa.me/5493815677391?text=${encodeURIComponent('¡Hola QRTech! Quiero el ' + p.nombre + ' (' + (p.catalogId || p.id) + ')')}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
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
  </div>
</TiltCard>
          ))}
        </div>

        {/* Botón Cargar más */}
        {visibles.length < total && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setPage((n) => n + 1)}
              className="rounded-xl bg-white/10 hover:bg-white/15 px-5 py-3 text-sm font-semibold border border-white/10"
            >
              Cargar más ({visibles.length}/{total})
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {total === 0 && (
          <p className="text-center opacity-70 mt-6">No encontramos productos para tu búsqueda.</p>
        )}
      </section>

      {/* Botón “Arriba” */}
      {showUp && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-4 bottom-24 z-40 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur px-3 py-2 text-sm"
          aria-label="Volver arriba"
        >
          ↑ Arriba
        </button>
      )}
    </main>
  );
}
