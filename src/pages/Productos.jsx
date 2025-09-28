// src/pages/Productos.jsx
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import data from '../data/productos.json';
import TrustBadges from '../components/TrustBadges';
import ProductoCard from '../components/ProductoCard';
import SeoHead from '../components/SeoHead';
import VariantSelector from '../components/VariantSelector';
import CompareModal from '../components/CompareModal';
import QuickFilters from '../components/QuickFilters';
import SortSelectCustom from '../components/SortSelect';
import { trackViewContent, trackWhatsAppClick } from "../lib/track";




function useQuery(){ return new URLSearchParams(useLocation().search); }

// Heurística de categoría (usa primero p.categoria si existe)
function guessCategory(p){
  const c = (p.categoria || '').toLowerCase().trim();
  if (c) return c;
  const t = (p.nombre || '').toLowerCase();
  if (t.includes('iphone')) return 'iphone';
  if (t.includes('ipad')) return 'ipad';
  if (t.includes('mac')) return 'mac';
  if (t.includes('watch')) return 'watch';
  if (t.includes('airpods')) return 'airpods';
  if (t.includes('samsung') || t.includes('motorola') || t.includes('xiaomi') ||
      t.includes('poco') || t.includes('redmi') || t.includes('galaxy')) return 'android';
  if (t.includes('cable') || t.includes('cargador') || t.includes('cargadores') ||
      t.includes('auricular') || t.includes('auriculares') || t.includes('parlante') ||
      t.includes('funda') || t.includes('protector') || t.includes('vidrio') ||
      t.includes('case') || t.includes('accesorio') ||
      t.includes('powerbank') || t.includes('power bank') || t.includes('magsafe') || t.includes('fuente'))
    return 'accesorios';
  return 'otros';
}

const CHIPS = [
  { key: 'all', label: 'Todos' },
  { key: 'iphone', label: 'iPhone' },
  { key: 'android', label: 'Android' },
  
  { key: 'accesorios', label: 'Accesorios' },
  { key: 'electrodomesticos', label: 'Electrodomesticos' },
];

const PAGE_SIZE = 8;

/** Helpers para Quick Filters (basados en variantes) */
function parseBatteryPct(s) {
  if (!s) return null;
  const m = String(s).match(/(\d{2,3})/);
  return m ? Math.max(0, Math.min(100, parseInt(m[1], 10))) : null;
}
function parseStorageGb(s) {
  if (!s) return null;
  const m = String(s).match(/(\d{2,4})/);
  return m ? parseInt(m[1], 10) : null;
}
function productHasSellado(p) {
  return Array.isArray(p?.variantes) && p.variantes.some(v => String(v?.condicion || '').toLowerCase().includes('sellado'));
}
function productHasBateriaAtLeast(p, pct) {
  if (!Array.isArray(p?.variantes)) return false;
  return p.variantes.some(v => (parseBatteryPct(v?.bateria) ?? 0) >= pct);
}
function productHasStorageAtLeast(p, gb) {
  if (!Array.isArray(p?.variantes)) return false;
  return p.variantes.some(v => (parseStorageGb(v?.storage) ?? 0) >= gb);
}
function productHasCondAPlus(p) {
  if (!Array.isArray(p?.variantes)) return false;
  return p.variantes.some(v => String(v?.condicion || '').toLowerCase().includes('usado a+'));
}
function productDisponible(p) {
  if (!Array.isArray(p?.variantes) || p.variantes.length === 0) return true;
  return p.variantes.some(v => v?.stock !== false);
}

export default function Productos(){
  const query = useQuery();
  const location = useLocation();
  const nav = useNavigate();

  const sku = query.get('sku');
  const initialCat = query.get('cat') || 'all';
  const initialSearch = query.get('q') || '';
  const initialFilters = (query.get('f') || '').split(',').filter(Boolean);

  // Comparador
  const initialCompare = (query.get('cmp') || '')
    .split(',')
    .filter(Boolean)
    .filter(id => data.some(p => p.id === id))
    .slice(0, 2);
  const [compare, setCompare] = useState(initialCompare);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleCompare = (id) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  // Búsqueda + categoría + filtros rápidos
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCat);
  const [filters, setFilters] = useState(initialFilters); // ['sellado','b90','128','aplus','disp']
  const initialSort = query.get('sort') || 'relevance';
  const [sort, setSort] = useState(initialSort);

  // Sync URL sin resetear scroll (q, cat, f, cmp)
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category !== 'all') params.set('cat', category);
    if (filters.length) params.set('f', filters.join(','));
    if (compare.length) params.set('cmp', compare.join(','));
    if (sort !== 'relevance') params.set('sort', sort);

    const searchStr = params.toString();
    const url = `/productos${searchStr ? `?${searchStr}` : ''}${location.hash || ''}`;
    window.history.replaceState(window.history.state, '', url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, filters, compare, sort]);

  // 👉 Track de productos cuando el modal de comparación se abre
useEffect(() => {
  if (!compareOpen) return;
  const compared = data.filter(p => compare.includes(p.id));
  compared.forEach((p) => {
    trackViewContent({
      id: p.id,
      name: p.nombre,
      priceUsd: p.precioUsd,
    });
  });
}, [compareOpen, compare]);


  // Auto-abrir comparador si viene en URL
  const initOpenChecked = useRef(false);
  useEffect(() => {
    if (initOpenChecked.current) return;
    initOpenChecked.current = true;
    const params = new URLSearchParams(location.search);
    const hasTwo = (params.get('cmp') || '').split(',').filter(Boolean).length >= 2;
    if (params.get('open') === 'cmp' && hasTwo) setCompareOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seleccionado = useMemo(() => data.find(p => p.id === sku), [sku]);
  const [variante, setVariante] = useState(null); // variante elegida en el selector
  const varSel = variante || null;                // alias consistente

  const filtrados = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return data.filter(p => {
      const okSearch = !needle || (p.nombre || '').toLowerCase().includes(needle);
      const okCat = category === 'all' || guessCategory(p) === category;
      if (!(okSearch && okCat)) return false;
      for (const f of filters) {
        if (f === 'sellado' && !productHasSellado(p)) return false;
        if (f === 'b90'     && !productHasBateriaAtLeast(p, 90)) return false;
        if (f === '128'     && !productHasStorageAtLeast(p, 128)) return false;
        if (f === 'aplus'   && !productHasCondAPlus(p)) return false;
        if (f === 'disp'    && !productDisponible(p)) return false;
      }
      return true;
    });
  }, [search, category, filters]);

  // Ordenar la lista filtrada según 'sort'
  const ordenados = useMemo(() => {
    const arr = [...filtrados];
    const getPrice = (p) => {
      if (typeof p?.precioUsd === "number") return p.precioUsd;
      const v = Array.isArray(p?.variantes)
        ? p.variantes.find(x => typeof x?.precioUsd === "number")
        : null;
      return v?.precioUsd ?? Infinity;
    };
    switch (sort) {
      case "price_asc":
        return arr.sort((a, b) => getPrice(a) - getPrice(b));
      case "price_desc":
        return arr.sort((a, b) => getPrice(b) - getPrice(a));
      case "featured":
        return arr.sort((a, b) => {
          if ((b.destacado ? 1 : 0) !== (a.destacado ? 1 : 0)) {
            return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
          }
          return getPrice(a) - getPrice(b);
        });
      default:
        return arr;
    }
  }, [filtrados, sort]);

  // Track del detalle (usa variante si existe para coincidir con el feed)
  useEffect(() => {
    if (!seleccionado) return;
    if (varSel && varSel.id) {
      trackViewContent({
        id: varSel.id,
        name: seleccionado.nombre,
        priceUsd: varSel.precioUsd,
      });
    } else {
      trackViewContent({
        id: seleccionado.id,
        name: seleccionado.nombre,
        priceUsd: seleccionado.precioUsd,
      });
    }
  }, [seleccionado, varSel]);

  // Auto-scroll al detalle cuando cambia ?sku=...
  const refDetalle = useRef(null);
  const [highlight, setHighlight] = useState(false);
  useEffect(() => {
    if (!seleccionado || !refDetalle.current) return;
    const id = requestAnimationFrame(() => {
      const headerOffset = 90;
      const rect = refDetalle.current.getBoundingClientRect();
      const top = window.scrollY + rect.top - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1200);
    });
    return () => cancelAnimationFrame(id);
  }, [seleccionado, location.key]);

  // Paginación
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [search, category, filters, sort]);
  const total = ordenados.length;
  const visibles = ordenados.slice(0, page * PAGE_SIZE);

  const categoryLabel = CHIPS.find(c => c.key === category)?.label;

  // Mostrar botón "Arriba"
  const [showUp, setShowUp] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowUp(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animaciones
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

    let name = 'Catálogo de equipos';
    if (category !== 'all') {
      const label = (CHIPS.find(c => c.key === category)?.label) || 'Catálogo';
      name = `${label} — catálogo QRTech`;
    }
    const tail = search ? ` — resultados para "${search}"` : '';

    return {
      title: `${name}${tail} | QRTech Tucumán`,
      description: 'Elegí tu equipo, calculá cuotas y coordiná retiro con garantía escrita. Atención con cita y plan canje.',
      url: `${base}/productos`,
      image: ogDefault,
      type: 'website',
      schema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${name}${tail}`,
        "description": "Catálogo QRTech con equipos (iPhone, Android, accesorios), cálculo de cuotas y coordinación de retiro con garantía.",
        "url": `${base}/productos`
      }
    };
  }, [seleccionado, category, search]);

  // Cotización guardada por Calculadora (si existe) → para barra móvil PDP
  const [cotRef] = useState(() => {
    const n = parseFloat(localStorage.getItem("qrtech_cotizacion") || "0");
    return Number.isFinite(n) ? n : 0;
  });

  /** ================= GALERÍA POR COLOR (único bloque) ================= */
  const [thumbIdx, setThumbIdx] = useState(0);                       // índice de thumbnail activa
  const colorKey = useMemo(() => (varSel?.color || "").trim(), [varSel]);

  const imagesForColor = useMemo(() => {
    const imgs = seleccionado?.imagenesPorColor || {};
    const normalized = Object.fromEntries(
      Object.entries(imgs).map(([k, v]) => [String(k).trim(), v])
    );
    const arr = normalized[colorKey];
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  }, [seleccionado, colorKey]);

  useEffect(() => { setThumbIdx(0); }, [seleccionado?.id, colorKey]);

  const mainImg = useMemo(() => {
    return imagesForColor[thumbIdx] || seleccionado?.imagen || '/img/placeholder.png';
  }, [imagesForColor, thumbIdx, seleccionado]);

  /** ================= RENDER ================= */
  return (
    <>
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
          <h1 className="text-[28px] sm:text-4xl md:text-5xl font-bold leading-tight">
            Encontrá tu próximo equipo
          </h1>
          <p className="mt-2 opacity-80 text-[15px] sm:text-base">Usados premium con garantía · Tucumán</p>

          <div className="mt-6 max-w-xl mx-auto">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar: iPhone 13 128, Pro Max, S23, iPad, AirPods, etc."
              className="w-full h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-[15px] md:text-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/30 transition"
            />
          </div>

          {/* Chips accesibles */}
          <div
            role="radiogroup"
            aria-label="Filtrar por categoría"
            className="mt-4 w-full flex flex-wrap justify-center gap-2.5"
          >
            {CHIPS.map((ch) => {
              const inputId = `chip-${ch.key}`;
              const checked = category === ch.key;
              return (
                <div key={ch.key} className="relative">
                  <input
                    id={inputId}
                    type="radio"
                    name="catalog-category"
                    value={ch.key}
                    checked={checked}
                    onChange={() => setCategory(ch.key)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={inputId}
                    role="radio"
                    aria-checked={checked}
                    className={[
                      "select-none cursor-pointer inline-flex items-center justify-center",
                      "px-4 py-2.5 rounded-full border min-h-[44px] text-[13px] transition",
                      "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
                      "peer-checked:bg-emerald-600/20 peer-checked:border-emerald-400/30 peer-checked:text-emerald-200",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400/60",
                      "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black",
                    ].join(" ")}
                  >
                    {ch.label}
                  </label>
                </div>
              );
            })}
          </div>

          <p className="sr-only" aria-live="polite">
            Categoría seleccionada: {CHIPS.find(c => c.key === category)?.label || category}
          </p>

          {/* Quick Filters */}
          <QuickFilters value={filters} onChange={setFilters} />
        </section>

        <div className="mt-4">
          <TrustBadges />
        </div>

        {/* Subheader sticky con resultados + orden */}
        <div className="sticky top-[56px] md:top-[64px] z-30 -mx-4 px-4 py-2.5 bg-gray-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between mt-6">
          <span className="text-[13px] opacity-80">
            {category!=='all' ? `Categoría: ${categoryLabel} · ` : ''}
            {search ? `Resultados para “${search}”` : 'Todos los productos'}
            {filters.length ? ` · Filtros: ${filters.length}` : ''}
          </span>

          <div className="flex items-center gap-3">
            <SortSelectCustom value={sort} onChange={setSort} />
            <span className="text-[13px] opacity-70">{visibles.length}/{total}</span>
          </div>
        </div>

        {/* PDP embebida si hay ?sku=... */}
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
              {/* Columna izquierda: imagen + thumbnails */}
              <div className="rounded-xl bg-white/5 p-4">
                <img
                  key={mainImg}
                  src={mainImg}
                  alt={`${seleccionado.nombre}${varSel?.color ? ` - ${varSel.color}` : ''}`}
                  className="w-full object-contain rounded-lg"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = seleccionado.imagen || '/img/placeholder.png'; }}
                />

                {imagesForColor.length > 1 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {imagesForColor.map((src, i) => {
                      const active = i === thumbIdx;
                      return (
                        <button
                          key={src + i}
                          type="button"
                          onClick={() => setThumbIdx(i)}
                          className={[
                            "h-16 w-16 rounded-lg overflow-hidden border transition",
                            active
                              ? "border-emerald-400/60 ring-2 ring-emerald-400/30"
                              : "border-white/10 hover:border-white/20"
                          ].join(" ")}
                          aria-label={`Ver imagen ${i + 1} de ${imagesForColor.length}`}
                        >
                          <img
                            src={src}
                            alt={`Vista ${i + 1} ${varSel?.color || ""}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Columna derecha: info y acciones */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{seleccionado.nombre}</h2>

                {/* Selector de variantes (si existen) */}
                {Array.isArray(seleccionado.variantes) && seleccionado.variantes.length > 0 && (
                  <VariantSelector
                      product={seleccionado}
                      onChange={(v) => {
                        setVariante(v);
                        // 👉 tracking adicional al elegir variante
                        trackViewContent({
                          id: v?.id || seleccionado.id,
                          name: seleccionado.nombre,
                          priceUsd: v?.precioUsd ?? seleccionado.precioUsd,
                        });
                      }}
                    />
                )}

                {/* Precio */}
                <div className="mt-3">
                  <div className="text-lg md:text-xl">
                    <span className="opacity-75 mr-2">Precio</span>
                    <strong>{`USD ${ (varSel?.precioUsd ?? seleccionado.precioUsd ?? 0) }`}</strong>
                  </div>
                  <p className="text-sm opacity-70">
                    Precios en USD de referencia. ARS al tipo de cambio del día del pago.
                  </p>

                  {/* Enlaces (WA + Calculadora) con variante efectiva */}
                  {(() => {
                    const number = "5493815677391";
                    const vDesc = [
                      varSel?.storage ? `• ${varSel.storage}` : null,
                      varSel?.condicion ? `• ${varSel.condicion}` : null,
                      varSel?.bateria ? `• Batería ${varSel.bateria}` : null
                    ].filter(Boolean).join(" ");
                    const precioSel = varSel?.precioUsd ?? seleccionado.precioUsd ?? 0;
                    const waText = encodeURIComponent(
                      `¡Hola QRTech! 👋\nQuiero consultar por: ${seleccionado.nombre}\n${vDesc}\n• Precio USD ${precioSel}\n`
                    );
                    const waHref = `https://wa.me/${number}?text=${waText}`;
                    const calcHref = `/calculadora?sku=${encodeURIComponent(seleccionado.id)}&price=${encodeURIComponent(precioSel)}&v=${encodeURIComponent(vDesc)}`;
                    return (
                      <div className="mt-5 flex gap-3">
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white"
                          aria-label={`Consultar ${seleccionado.nombre} por WhatsApp`}
                          onClick={() =>
                            trackWhatsAppClick({
                              id: (varSel && varSel.id) || seleccionado.id,
                              name: seleccionado.nombre,
                              priceUsd: precioSel,
                              location: "pdp",
                            })
                          }
                        >
                          Consultar por WhatsApp
                        </a>
                        <Link to={calcHref} className="rounded-xl bg-white/10 px-4 py-3 font-semibold">
                          Ver cuotas
                        </Link>
                      </div>
                    );
                  })()}
                </div>

                {/* Microcopy de confianza */}
                <ul className="mt-4 text-sm opacity-80 list-disc pl-4">
                  <li>Garantía QRTech escrita</li>
                  <li>Retiro en San Lorenzo 987 (con cita)</li>
                  <li>Revisión en oficina al retirar</li>
                </ul>
                <p className="mt-3 text-sm opacity-70">Batería y estado verificados. Consultá disponibilidad actual.</p>
              </div>
            </div>
          </article>
        )}

        {/* GRID */}
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
                <div className="mt-2">
                  <button
                    onClick={() => toggleCompare(p.id)}
                    className={[
                      "w-full rounded-lg border px-3 py-2 text-sm transition",
                      compare.includes(p.id)
                        ? "bg-emerald-600/20 border-emerald-400/40 text-emerald-200"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    ].join(" ")}
                    aria-pressed={compare.includes(p.id)}
                    aria-label={compare.includes(p.id) ? "Quitar de la comparación" : "Agregar a comparación"}
                  >
                    {compare.includes(p.id) ? "✓ En comparación" : "Comparar"}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Paginación: Ver más */}
          {total > 0 && visibles.length < total ? (
            <div className="mt-6 mb-24 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((n) => n + 1)}
                className="rounded-xl bg-white/10 hover:bg-white/15 px-6 py-3.5 text-[14px] font-semibold border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label={`Ver más productos: ${visibles.length} de ${total}`}
              >
                Ver más ({Math.min(visibles.length, total)}/{total})
              </button>
            </div>
          ) : null}

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

        {/* Barra flotante móvil PDP */}
        {seleccionado && (
          <div className="fixed inset-x-0 bottom-0 md:hidden z-[60]">
            <div className="mx-auto max-w-3xl px-4 pb-[env(safe-area-inset-bottom)]">
              <div className="rounded-t-2xl bg-slate-900/95 backdrop-blur border border-white/10 p-3 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[13px]">
                    <div className="opacity-70">Total referencia</div>
                    <div className="text-lg font-bold">
                      {(() => {
                        const priceSel = (varSel?.precioUsd ?? seleccionado.precioUsd ?? 0);
                        const totalRef = cotRef ? Math.round(priceSel * cotRef).toLocaleString("es-AR") : null;
                        return totalRef ? `$${totalRef} ARS` : `USD ${priceSel}`;
                      })()}
                    </div>
                  </div>

                  {(() => {
                    const number = "5493815677391";
                    const vDesc = [
                      varSel?.storage ? `• ${varSel.storage}` : null,
                      varSel?.condicion ? `• ${varSel.condicion}` : null,
                      varSel?.bateria ? `• Batería ${varSel.bateria}` : null
                    ].filter(Boolean).join(" ");
                    const precioSel = varSel?.precioUsd ?? seleccionado.precioUsd ?? 0;
                    const waText = encodeURIComponent(
                      `¡Hola QRTech! 👋\nQuiero consultar por: ${seleccionado.nombre}\n${vDesc}\n• Precio USD ${precioSel}\n`
                    );
                    const waHref = `https://wa.me/${number}?text=${waText}`;
                    const calcHref = `/calculadora?sku=${encodeURIComponent(seleccionado.id)}&price=${encodeURIComponent(precioSel)}&v=${encodeURIComponent(vDesc)}`;

                    return (
                      <div className="flex gap-2">
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-white font-semibold text-[15px]"
                          onClick={() =>
                            trackWhatsAppClick({
                              id: (varSel && varSel.id) || seleccionado.id,
                              name: seleccionado.nombre,
                              priceUsd: precioSel,
                              location: "pdp_bar",
                            })
                          }
                          aria-label={`Consultar ${seleccionado.nombre} por WhatsApp`}
                        >
                          WhatsApp
                        </a>

                        <Link
                          to={calcHref}
                          className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 font-semibold text-[15px] border border-white/10"
                          aria-label={`Ver cuotas de ${seleccionado.nombre}`}
                        >
                          Ver cuotas
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Separador para que la barra no tape el contenido */}
            <div className="h-24" />
          </div>
        )}
      </main>

      
      {/* Modal de comparación (2 equipos) */}
{/* Modal de comparación (2 equipos) */}
<CompareModal
  open={compareOpen}
  onClose={() => setCompareOpen(false)}
  products={data.filter(p => compare.includes(p.id))}
/>



    </>
  );
}
