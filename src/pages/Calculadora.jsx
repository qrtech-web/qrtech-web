// src/pages/Calculadora.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";
import { ShieldCheck, RefreshCw, Store, CreditCard } from "lucide-react";

/** 1) Lee parámetros de la URL (ej: ?sku=ip12&price=520&v=%E2%80%A2%20128GB%20%E2%80%A2%20Usado%20A%2B%20%E2%80%A2%20Bater%C3%ADa%20%E2%89%A590%25) */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/** 2) Coeficientes por cantidad de cuotas (ajustá si cambia tu financ.) */
const COEF = { 1: 1.1, 2: 1.2341, 3: 1.2919, 6: 1.4819, 9: 1.7337, 12: 1.9984 };

/** 3) Números de cuotas mostradas en tarjetas */
const CUOTAS = [1, 2, 3, 6, 9, 12];

/** 4) Parsea "450.00 USD" -> 450 */
function parseUSD(s) {
  if (typeof s === "number") return s;
  if (!s) return 0;
  const m = String(s).match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}

export default function Calculadora() {
  const q = useQuery();
  const loc = useLocation();

  const sku = q.get("sku");                 // SKU que llega por URL (ej: ip12)
  const priceParam = q.get("price");        // override de precio (viene desde PDP)
  const variantDesc = q.get("v");           // descripción legible de la variante

  const st = useMemo(() => loc.state ?? {}, [loc.state]);

  // Estados principales
  const [nombre, setNombre] = useState(st.nombre || "");
  const [precioUsd, setPrecioUsd] = useState(parseUSD(st.precio) || 0);
  const [cotizacion, setCotizacion] = useState(0);
  const [cotizFuente, setCotizFuente] = useState("");
  const [imagen, setImagen] = useState(st.imagen || "");
  const [cuotasSel, setCuotasSel] = useState(null);
  const [warn, setWarn] = useState("");

  // Persistimos cotización manual
  useEffect(() => {
    const saved = localStorage.getItem("qrtech_cotizacion");
    if (saved) setCotizacion(parseFloat(saved) || 0);
  }, []);
  useEffect(() => {
    localStorage.setItem("qrtech_cotizacion", String(cotizacion || 0));
  }, [cotizacion]);

  // Carga de datos desde feed o JSON local + override de precio por query
  useEffect(() => {
    let cancel = false;

    async function loadFromFeeds(id) {
      try {
        const res = await fetch("/products-feed.json", { cache: "no-store" });
        if (res.ok) {
          const arr = await res.json();
          const item = Array.isArray(arr) ? arr.find((x) => x.id === id) : null;
          if (item && !cancel) {
            setNombre(item.title || id);
            // Si NO vino ?price=..., usamos el feed
            if (!(priceParam && !Number.isNaN(Number(priceParam)))) {
              setPrecioUsd(parseUSD(item.price));
            }
            setImagen(item.image_link || "");
            return true;
          }
        }
      } catch {}
      try {
        const local = await import("../data/productos.json");
        const item = local.default?.find?.((x) => x.id === id);
        if (item && !cancel) {
          setNombre(item.nombre || id);
          if (!(priceParam && !Number.isNaN(Number(priceParam)))) {
            setPrecioUsd(parseFloat(item.precioUsd) || 0);
          }
          setImagen(item.imagen || "");
          return true;
        }
      } catch {}
      return false;
    }

    (async () => {
      // 1) Si viene ?price=..., priorizar ese valor
      if (priceParam && !Number.isNaN(Number(priceParam))) {
        setPrecioUsd(parseFloat(priceParam));
      }

      // 2) Intentar levantar info del producto por sku (nombre/imagen y, si no vino price, precio)
      if (sku) {
        const ok = await loadFromFeeds(sku);
        if (ok || cancel) return;
      }

      // 3) Fallback: estado de navegación
      if (!cancel && st && (st.nombre || st.precio || st.imagen)) {
        setNombre(st.nombre || sku || "Producto");
        if (!(priceParam && !Number.isNaN(Number(priceParam)))) {
          setPrecioUsd(parseUSD(st.precio));
        }
        setImagen(st.imagen || "");
        return;
      }

      // 4) Fallback: último producto visto en sessionStorage
      try {
        const raw = sessionStorage.getItem("qrtech:lastProduct");
        if (raw && !cancel) {
          const p = JSON.parse(raw);
          setNombre(p.nombre || sku || "Producto");
          if (!(priceParam && !Number.isNaN(Number(priceParam)))) {
            setPrecioUsd(parseUSD(p.precio));
          }
          setImagen(p.imagen || "");
          return;
        }
      } catch {}

      // 5) Último recurso: mostrar el sku como nombre
      if (!cancel) setNombre(sku || "Producto");
    })();

    return () => {
      cancel = true;
    };
  }, [sku, st, priceParam]);

  // Cotización automática
  useEffect(() => {
    let cancel = false;
    async function fetchCotizacion() {
      setWarn("");
      try {
        const r1 = await fetch("https://api.bluelytics.com.ar/v2/latest", { cache: "no-store" });
        if (r1.ok) {
          const j = await r1.json();
          const blue = j?.blue?.value_avg || j?.blue?.value_sell || j?.blue?.value_buy;
          if (blue && !cancel) {
            setCotizacion(blue);
            setCotizFuente("Dólar blue (bluelytics)");
            return;
          }
        }
      } catch {}
      try {
        const r2 = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=ARS", { cache: "no-store" });
        if (r2.ok) {
          const j2 = await r2.json();
          const val = j2?.rates?.ARS;
          if (val && !cancel) {
            setCotizacion(val);
            setCotizFuente("Oficial (exchangerate.host)");
            return;
          }
        }
      } catch {}
      if (!cancel) setWarn("No pude obtener la cotización automática. Podés ingresarla manualmente.");
    }
    fetchCotizacion();
    return () => {
      cancel = true;
    };
  }, []);

  // control visual de la carga de la imagen
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    setImgLoaded(false);
  }, [imagen]);

  // Resumen selección (cuando hay plan de cuotas elegido)
  const resumenSeleccion = useMemo(() => {
    if (!precioUsd || !cotizacion || !cuotasSel) return null;
    const totalArs = precioUsd * cotizacion * COEF[cuotasSel];
    const cuotaArs = totalArs / cuotasSel;
    return { totalArs, cuotaArs };
  }, [precioUsd, cotizacion, cuotasSel]);

  // Link WA armado
  const waLink = useMemo(() => {
    const fmtArs = (n) => Math.round(Number(n || 0)).toLocaleString("es-AR");
    const totalContado = (precioUsd || 0) * (cotizacion || 0);

    const lineas = [
      "¡Hola QRTech! 👋",
      `Quiero consultar por: ${nombre || sku || "producto"}`,
      variantDesc ? variantDesc : null, // ← muestra “• 128GB • Usado A+ • Batería ≥90%”
      precioUsd ? `• ${precioUsd} USD` : null,
      cuotasSel && resumenSeleccion
        ? `• ${cuotasSel} cuotas: $${fmtArs(resumenSeleccion.cuotaArs)} ARS\n  Total financiado: $${fmtArs(resumenSeleccion.totalArs)} ARS`
        : `• Total referencia contado: $${fmtArs(totalContado)} ARS`,
    ].filter(Boolean);

    const text = encodeURIComponent(lineas.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [nombre, sku, precioUsd, cotizacion, cuotasSel, resumenSeleccion, variantDesc]);

  const totalRef = precioUsd && cotizacion ? Math.round(precioUsd * cotizacion) : 0;
  const cuotaSel =
    cuotasSel && cotizacion
      ? Math.round(((precioUsd || 0) * (cotizacion || 0) * COEF[cuotasSel]) / cuotasSel)
      : 0;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* 12) Cabecera: Imagen + Precio + Cotización */}
      <section className="grid gap-6 md:grid-cols-[340px_1fr] items-start">
        {/* Imagen con shimmer + cinta sin recorte */}
        <div className="relative">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
            <div className="relative rounded-xl overflow-hidden bg-white/5">
              <div
                className={[
                  "absolute inset-0 pointer-events-none transition-opacity duration-500",
                  "bg-gradient-to-br from-white/10 via-white/5 to-transparent animate-pulse",
                  imgLoaded ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <img
                src={imagen || "/img/placeholder.png"}
                alt={`Foto ${nombre || sku || "Producto"}`}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className="w-full h-auto rounded-xl object-contain relative z-[1]"
              />
            </div>
          </div>
        </div>

        {/* Panel de datos */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 md:p-6">
          <h2 className="text-[22px] md:text-4xl font-extrabold tracking-tight mb-3">
            {nombre || "Producto"}
          </h2>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-300 px-2.5 py-1 text-[12px] md:text-[11px]">
              <ShieldCheck className="w-4 h-4 md:w-3.5 md:h-3.5" /> Garantía escrita
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 text-sky-300 px-2.5 py-1 text-[12px] md:text-[11px]">
              <Store className="w-4 h-4 md:w-3.5 md:h-3.5" /> Retiro en oficina
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-500/15 text-fuchsia-300 px-2.5 py-1 text-[12px] md:text-[11px]">
              <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5" /> Plan canje
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-300 px-2.5 py-1 text-[12px] md:text-[11px]">
              <CreditCard className="w-4 h-4 md:w-3.5 md:h-3.5" /> Hasta 12 cuotas
            </span>
          </div>

          <label className="block text-[13px] md:text-sm opacity-80 mb-1">Precio (USD)</label>
          <input
            type="number"
            value={precioUsd || ""}
            onChange={(e) => setPrecioUsd(parseFloat(e.target.value) || 0)}
            className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-[15px]
                       focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/30 transition"
            placeholder="Ej: 520"
          />
          <hr className="my-4 border-white/10" />

          <label className="block text-[13px] md:text-sm opacity-80 mb-1">Cotización USD → ARS</label>
          <input
            type="number"
            value={cotizacion || ""}
            onChange={(e) => setCotizacion(parseFloat(e.target.value) || 0)}
            className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-[15px]
                       focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/30 transition"
            placeholder="Ej: 1400"
          />
          <p className="text-[12px] md:text-xs opacity-70 mt-1">{cotizFuente || "Manual"}</p>
          <hr className="my-4 border-white/10" />

          <p className="mt-3 text-[14px] md:text-sm opacity-80">
            {precioUsd && cotizacion ? (
              <>
                ≈ <strong>${(precioUsd * cotizacion).toFixed(0)} ARS</strong>
              </>
            ) : warn ? (
              <span className="text-amber-400">{warn}</span>
            ) : (
              <>Ingresá precio y/o cotización para calcular en ARS</>
            )}
          </p>
        </div>
      </section>

      {/* Resumen de precio */}
      <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] md:text-sm opacity-80">Total referencia (contado)</p>
          <p className="text-xl md:text-2xl font-bold">
            ${Math.round((precioUsd || 0) * (cotizacion || 0)).toLocaleString("es-AR")} ARS
          </p>
        </div>

        {cuotasSel ? (
          <div className="text-right">
            <p className="text-[13px] md:text-sm opacity-80">Plan seleccionado</p>
            <p className="text-lg md:text-xl font-semibold">
              {cuotasSel} cuotas de $
              {Math.round(((precioUsd || 0) * (cotizacion || 0) * COEF[cuotasSel]) / cuotasSel).toLocaleString("es-AR")} ARS
            </p>
            <p className="text-[12px] md:text-xs opacity-70">
              Total $
              {Math.round((precioUsd || 0) * (cotizacion || 0) * COEF[cuotasSel]).toLocaleString("es-AR")} ARS
            </p>
          </div>
        ) : (
          <div className="text-[13px] md:text-sm opacity-70">Seleccioná una financiación para ver la cuota.</div>
        )}
      </div>

      {/* 13) Cuotas en tarjetas (tamaño táctil) */}
      <section className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CUOTAS.map((n) => {
            const total = precioUsd && cotizacion ? precioUsd * cotizacion * COEF[n] : 0;
            const cuota = total && n ? total / n : 0;
            const activa = cuotasSel === n;

            return (
              <button
                key={n}
                type="button"
                onClick={() => setCuotasSel((prev) => (prev === n ? null : n))}
                className={[
                  "rounded-xl p-4 md:p-5 text-left transition-all duration-200 border shadow",
                  "bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-lg",
                  activa && "ring-2 ring-emerald-400 bg-emerald-500/10 border-emerald-300/30",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={activa}
              >
                <span className="block text-[12px] md:text-xs opacity-80">Plan</span>
                <span className="block text-base md:text-lg font-semibold mb-1">{n} cuotas</span>
                <span className="block text-2xl md:text-3xl font-extrabold text-emerald-300">
                  ${Math.round(cuota).toLocaleString("es-AR")}
                </span>
                <span className="block text-[11px] md:text-[11px] opacity-70 mt-1">
                  Total: ${Math.round(total).toLocaleString("es-AR")}
                </span>
                {activa && (
                  <span className="mt-2 inline-block text-[11px] text-emerald-300">
                    ✓ Usaremos este plan en el mensaje
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-[13px] md:text-sm text-center opacity-80 mt-3">
          Tocá una tarjeta para seleccionar/deseleccionar la financiación.
        </p>
      </section>

      {/* CTA WhatsApp (desktop) */}
      <div className="mt-6 hidden md:flex justify-center">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white text-base"
          onClick={() => {
            trackWhatsAppClick({ name: nombre || sku, priceUsd: precioUsd, location: "calculadora" });
            try {
              window.fbq?.("track", "Contact", { content_ids: [sku || nombre], content_type: "product" });
            } catch {}
          }}
        >
          🟢 Consultar por WhatsApp
        </a>
      </div>

      {/* separador para que la barra no tape el contenido */}
      <div className="h-24 md:hidden" />

      {/* Barra fija móvil */}
      <div className="fixed inset-x-0 bottom-0 md:hidden z-50">
        <div className="mx-auto max-w-3xl px-4 pb-[env(safe-area-inset-bottom)]">
          <div className="rounded-t-2xl bg-slate-900/90 backdrop-blur border border-white/10 p-3 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[13px]">
                <div className="opacity-70">Total referencia</div>
                <div className="text-lg font-bold">${totalRef.toLocaleString("es-AR")} ARS</div>
                {cuotasSel ? (
                  <div className="text-[12px] opacity-80">
                    {cuotasSel} cuotas de ${cuotaSel.toLocaleString("es-AR")} ARS
                  </div>
                ) : null}
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({ name: nombre || sku, priceUsd: precioUsd, location: "calculadora_floating" })
                }
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3.5 text-white font-semibold text-[15px]"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
