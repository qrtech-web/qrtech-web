// src/pages/Productos.jsx
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import data from '../data/productos.json';
import TrustBadges from '../components/TrustBadges';
import ProductoCard from '../components/ProductoCard';
import SeoHead from '../components/SeoHead';

function useQuery(){ return new URLSearchParams(useLocation().search); }

// Meta Pixel: ViewContent del producto seleccionado
function trackViewContent(prod){
  try{
    if(!window.fbq || !prod) return;
    const catalogId = prod.catalogId || prod.id;
    window.fbq('track', 'ViewContent', {
      content_ids: [catalogId],
      content_type: 'product',
      value: prod.precioUsd,
      currency: 'USD'
    });
  }catch(_){}
}

// heurística mínima para chips de categorías
function guessCategory(p){
  const t = (p.nombre || '').toLowerCase();
  if(t.includes('iphone')) return 'iphone';
  if(t.includes('ipad')) return 'ipad';
  if(t.includes('mac')) return 'mac';
  if(t.includes('watch')) return 'watch';
  if(t.includes('airpods')) return 'airpods';
  if (t.includes('cable') || t.includes('funda') || t.includes('cargador') || t.includes('accesorio')) return 'accesorios';
  return 'otros';
}

const CHIPS = [
  { key: 'all', label: 'Todos' },
  { key: 'iphone', label: 'iPhone' },
  { key: 'ipad', label: 'iPad' },
  { key: 'mac', label: 'Mac' },
  { key: 'watch', label: 'Watch' },
  { key: 'airpods', label: 'AirPods' },
  { key: 'accesorios', label: 'Accesorios' },
];

// Tamaño de página (cuántos ítems por “Ver más”)
const PAGE_SIZE = 8;

export default function Productos(){
  const query = useQuery();
  const location = useLocation();
  const nav = useNavigate();
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
      const headerOffset = 90; // altura aprox. navbar
      const rect = refDetalle.current.getBoundingClientRect();
      const top = window.scrollY + rect.top - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1200);
    });
    return () => cancelAnimationFrame(id);
  }, [seleccionado, location.key]);

  // Paginación “Ver más”
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

  // Animaciones de entrada en “stagger”
  const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  // SEO dinámico
  const meta = useMemo(() => {
    const base = 'https://qrtech.com.ar';
    const ogDefault = `${base}/og/cover.jpg`;

    if (seleccionado) {
      return {
        title: `${seleccionado.nombre} — precio, cuotas y garantía | QRTech Tucumán`,
        description: `Usado premium con garantía escrita. Retiro en San Lorenzo 987 con cita. Consultá por WhatsApp por ${seleccionado.nombre}.`,
        url: `${base}/productos?sku=${encodeURIComponent(seleccionado.id)}`,
        image: seleccionado.imagen || ogDefault,
        type: 'product',
        schema: {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": seleccionado.nombre,
          "image": seleccionado.imagen ? [seleccionado.imagen] : undefined,
          "brand": { "@type": "Brand", "name": "Apple" },
          "sku": seleccionado.id,
          "offers": {
            "@type": "Offer",
            "price": String(seleccionado.precioUsd || 0),
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStoreOnly",
            "url": `${base}/productos?sku=${encodeURIComponent(seleccionado.id)}`
          }
        }
      };
    }

    let name = 'Catálogo de iPhones usados premium';
    if (category !== 'all') {
      const label = (CHIPS.find(c => c.key === category)?.label) || 'Catálogo';
      name = `${label} — catálogo QRTech`;
    }
    const tail = search ? ` — resultados para "${search}"` : '';

    return {
      title: `${name}${tail} | QRTech Tucumán`,
      description: 'Elegí tu iPhone, calculá cuotas y coordiná retiro con garantía escrita. Atención con cita y plan canje.',
      url: `${base}/productos`,
      image: ogDefault,
      type: 'website',
      schema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${name}${tail}`,
        "description": "Catálogo QRTech con iPhones usados premium, cálculo de cuotas y coordinación de retiro con garantía.",
        "url": `${base}/productos`
      }
    };
  }, [seleccionado, category, search]);

  return (
    <main className="container mx-auto px-4 py-6">
      <SeoHead
        title={meta.title}
        description={meta.description}
        url={meta.url}
        image={meta.image}
        type={meta.type}
        schema={meta.schema}
      />

      {/* HERO con buscador grande + chips */}
      <section className="text-center">
        <h1 className="text-[28px] sm:text-4xl md:text-5xl font-bold font-carter leading-tight">
          Encontrá tu próximo iPhone
        </h1>
        <p className="mt-2 opacity-85 text-[15px] sm:text-base">Usados premium con garantía · Tucumán</p>

        <div className="mt-6 max-w-xl mx-auto">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar: iPhone 13 128, Pro Max, iPad, etc."
            className="w-full h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-[15px] md:text-lg
                       focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/30 transition"
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {CHIPS.map((ch) => (
            <button
              key={ch.key}
              onClick={() => setCategory(ch.key)}
              className={[
                "rounded-full px-4 py-2.5 text-[13px] border transition",
                category === ch.key
                  ? "bg-emerald-600/20 border-emerald-400/30 text-emerald-200"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              ].join(' ')}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-4">
        <TrustBadges />
      </div>

      {/* Subheader sticky con resultados (más alto y legible en móvil) */}
      <div className="sticky top-[56px] md:top-[64px] z-30 -mx-4 px-4 py-2.5 bg-gray-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between mt-6">
        <span className="text-[13px] opacity-85">
          {category!=='all' ? `Categoría: ${categoryLabel} · ` : ''}{search ? `Resultados para “${search}”` : 'Todos los productos'}
        </span>
        <span className="text-[13px] opacity-70">{visibles.length}/{total}</span>
      </div>

      {seleccionado && (
        <article
          ref={refDetalle}
          className={[
            "mt-8 rounded-2xl border bg-white/5 p-4 md:p-6",
            highlight ? "ring-2 ring-emerald-400/50" : "border-white/10"
          ].join(' ')}
        >
          {/* Barra de cabecera del detalle */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-sm opacity-75">Viendo: <strong>{seleccionado.nombre}</strong></span>
            <button
              onClick={() => nav('/productos#grid')}
              className="text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5"
              aria-label="Cerrar detalle y volver al listado"
            >
              Cerrar detalle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white/5 p-4">
              <img src={seleccionado.imagen} alt={seleccionado.nombre} className="w-full object-contain rounded-lg" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-carter">{seleccionado.nombre}</h2>
              <p className="mt-2 text-blue-300 text-xl font-semibold">${seleccionado.precioUsd} USD</p>
              <ul className="mt-3 text-sm opacity-80 list-disc pl-4">
                <li>Garantía QRTech escrita</li>
                <li>Retiro en San Lorenzo 987 (con cita)</li>
                <li>Revisión en oficina al retirar</li>
              </ul>
              <p className="mt-4 text-sm opacity-70">Batería y estado verificados. Consultá disponibilidad actual.</p>
              <div className="mt-5 flex gap-3">
                <a
                  href={seleccionado.wa || `https://wa.me/5493815677391?text=${encodeURIComponent('¡Hola QRTech! Quiero el ')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white"
                  onClick={() => {
                    try {
                      window.fbq?.('track', 'Lead', {
                        content_ids: [ (seleccionado?.catalogId || seleccionado?.id) ],
                        content_type: 'product'
                      });
                    } catch {}
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
          </div>
        </article>
      )}

      {/* GRID: 2 columnas hasta md/lg, luego 3/4 – con “stagger” */}
      <section id="grid" className="mt-8 scroll-mt-24 md:scroll-mt-32">
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
        >
          {visibles.map((p) => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProductoCard producto={p} />
            </motion.div>
          ))}
        </motion.div>

        {/* Paginación: Ver más (botón más alto/legible en mobile) */}
        {visibles.length < total && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setPage((n) => n + 1)}
              className="rounded-xl bg-white/10 hover:bg-white/15 px-6 py-3.5 text-[14px] font-semibold border border-white/10"
            >
              Ver más ({visibles.length}/{total})
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
          className="fixed right-4 bottom-24 z-40 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur px-3 py-2 text-sm"
          aria-label="Volver arriba"
        >
          ↑ Arriba
        </button>
      )}
    </main>
  );
}
