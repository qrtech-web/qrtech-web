// src/pages/Calculadora.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

/** 1) Lee parámetros de la URL (ej: ?sku=ip12pm) */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/** 2) Coeficientes por cantidad de cuotas (ajustá si cambia tu financ.) */
const COEF = { 1: 1.1000, 2: 1.2341, 3: 1.2919, 6: 1.4819, 9: 1.7337, 12: 1.9984 };

/** 3) Números de cuotas mostradas en tabla */
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
  const sku = q.get("sku");              // 5) SKU que llega por URL

  // 6) Estados principales
  const [nombre, setNombre] = useState("");           // 6.1) Nombre legible
  const [precioUsd, setPrecioUsd] = useState(0);      // 6.2) Precio (editable)
  const [cotizacion, setCotizacion] = useState(0);    // 6.3) USD→ARS (editable y/o auto)
  const [cotizFuente, setCotizFuente] = useState(""); // 6.4) Fuente de la cotización (info)
  const [imagen, setImagen] = useState("");           // 6.5) Imagen del equipo
  const [cuotasSel, setCuotasSel] = useState(null);   // 6.6) Selección en tabla
  const [warn, setWarn] = useState("");               // 6.7) Aviso si falla la cotización

  // 7) Persistimos la cotización manual si el usuario la edita (comodidad)
  useEffect(() => {
    const saved = localStorage.getItem("qrtech_cotizacion");
    if (saved) setCotizacion(parseFloat(saved) || 0);
  }, []);
  useEffect(() => {
    localStorage.setItem("qrtech_cotizacion", String(cotizacion || 0));
  }, [cotizacion]);

  // 8) Carga de datos desde /products-feed.json (y fallback a productos.json)
  useEffect(() => {
    let cancel = false;
    async function loadProducto() {
      try {
        // 8.1) Feed público (mismo origen)
        const res = await fetch("/products-feed.json", { cache: "no-store" });
        if (!res.ok) throw new Error("No pude leer /products-feed.json");
        const arr = await res.json();
        const item = Array.isArray(arr) ? arr.find((x) => x.id === sku) : null;

        if (item && !cancel) {
          setNombre(item.title || sku);
          setPrecioUsd(parseUSD(item.price));
          setImagen(item.image_link || "");
          return;
        }
      } catch (e) {
        // sigue el fallback
      }
      try {
        // 8.2) Fallback: tu JSON local de productos (si existe en el bundle)
        const local = await import("../data/productos.json");
        const item = local.default?.find?.((x) => x.id === sku);
        if (item && !cancel) {
          setNombre(item.nombre || sku);
          setPrecioUsd(parseFloat(item.precioUsd) || 0);
          setImagen(item.imagen || "");
        } else if (!cancel) {
          setNombre(sku || "Producto");
        }
      } catch (e) {
        if (!cancel) setNombre(sku || "Producto");
      }
    }
    if (sku) loadProducto();
    return () => { cancel = true; };
  }, [sku]);

  // 9) Cotización automática: intenta blue, luego oficial; si todo falla, muestra aviso y deja manual
  useEffect(() => {
    let cancel = false;
    async function fetchCotizacion() {
      setWarn("");
      try {
        // 9.1) Intento 1: dólar blue (muy usado en AR para retail)
        const r1 = await fetch("https://api.bluelytics.com.ar/v2/latest", { cache: "no-store" });
        if (r1.ok) {
          const j = await r1.json();
          // tomamos promedio compra/venta
          const blue = (j.blue?.value_avg || j.blue?.value_sell || j.blue?.value_buy);
          if (blue && !cancel) {
            setCotizacion(blue);
            setCotizFuente("Dólar blue (bluelytics)");
            return;
          }
        }
      } catch {}
      try {
        // 9.2) Intento 2: oficial (exchangerate.host)
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
      // 9.3) Si falla todo: dejamos manual y avisamos
      if (!cancel) {
        setWarn("No pude obtener la cotización automática. Podés ingresarla manualmente.");
      }
    }
    fetchCotizacion();
    return () => { cancel = true; };
  }, []); // se trae al cargar la página

  // 10) Resumen de selección (total/ cuota) para el mensaje
  const resumenSeleccion = useMemo(() => {
    if (!precioUsd || !cotizacion || !cuotasSel) return null;
    const totalArs = precioUsd * cotizacion * COEF[cuotasSel];
    const cuotaArs = totalArs / cuotasSel;
    return { totalArs, cuotaArs };
  }, [precioUsd, cotizacion, cuotasSel]);

  // 11) Link WA armado
  const waLink = useMemo(() => {
    const base = "https://wa.me/5493815677391";
    const partes = [
      `¡Hola QRTech!`,
      `Quiero el ${nombre || sku || "producto"}`,
      precioUsd ? `Precio: ${precioUsd} USD` : null,
      cotizacion ? `Cotización: $${cotizacion} ARS${cotizFuente ? ` (${cotizFuente})` : ""}` : null,
      cuotasSel && resumenSeleccion
        ? `Plan: ${cuotasSel} cuotas de $${resumenSeleccion.cuotaArs.toFixed(0)} ARS (total ${resumenSeleccion.totalArs.toFixed(0)} ARS)`
        : null,
    ].filter(Boolean);
    const text = encodeURIComponent(partes.join(" · "));
    return `${base}?text=${text}`;
  }, [nombre, sku, precioUsd, cotizacion, cotizFuente, cuotasSel, resumenSeleccion]);

  return (
    <main className="container mx-auto px-4 py-10 pt-24">
      {/* ↑ pt-24 evita superposición si tu Navbar es fixed; la quitamos si lo volvés sticky */}

      {/* 12) Cabecera: Imagen + Precio + Cotización */}
      <section className="grid gap-6 md:grid-cols-[320px_1fr] items-start">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
          {/* 12.1) Imagen del producto (si no hay, mostramos un placeholder simple) */}
          <img
            src={imagen || "/img/placeholder.png"}
            alt={`Foto ${nombre || sku || "Producto"}`}
            loading="lazy"
            className="w-full h-auto rounded-xl object-contain"
          />
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="text-2xl font-bold mb-2">{nombre || "Producto"}</h2>

          {/* 12.2) Precio USD (editable) */}
          <label className="block text-sm opacity-80 mb-1">Precio (USD)</label>
          <input
            type="number"
            value={precioUsd || ""}
            onChange={(e) => setPrecioUsd(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-white/15 bg-white/10 p-3 mb-3"
            placeholder="Ej: 420"
          />

          {/* 12.3) Cotización auto (editable) + fuente */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm opacity-80 mb-1">Cotización USD → ARS</label>
              <input
                type="number"
                value={cotizacion || ""}
                onChange={(e) => setCotizacion(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-white/15 bg-white/10 p-3"
                placeholder="Ej: 1400"
              />
            </div>
            <div className="text-xs opacity-70 mt-6">{cotizFuente || "Manual"}</div>
          </div>

          {/* 12.4) Vista rápida en ARS o aviso */}
          <p className="mt-3 text-sm opacity-80">
            {precioUsd && cotizacion ? (
              <>≈ <strong>${(precioUsd * cotizacion).toFixed(0)} ARS</strong></>
            ) : warn ? (
              <span className="text-amber-400">{warn}</span>
            ) : (
              <>Ingresá precio y/o cotización para calcular en ARS</>
            )}
          </p>
        </div>
      </section>

      {/* 13) Tabla de cuotas */}
      <section className="mt-8 overflow-x-auto rounded-2xl border border-white/15">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Cuotas</th>
              <th className="p-3">Total ARS</th>
              <th className="p-3">Cuota ARS</th>
            </tr>
          </thead>
          <tbody>
            {CUOTAS.map((n) => {
              const total = precioUsd && cotizacion ? precioUsd * cotizacion * COEF[n] : 0;
              const cuota = total && n ? total / n : 0;
              const activa = cuotasSel === n; // 13.1) ¿esta fila está seleccionada?

              return (
                <tr
                  key={n}
                  // 13.2) Clases dinámicas (tu string adaptado a Tailwind): odd/even + selected
                  className={`cursor-pointer transition-colors duration-200
                    ${activa ? 'text-green-400 opacity-100' : 'hover:opacity-70'}
                    odd:bg-slate-600 even:bg-blue-950 border-t border-white/10`}
                  // 13.3) Click: si clickeás la misma, se des-selecciona; si no, se selecciona
                  onClick={() => setCuotasSel((prev) => (prev === n ? null : n))}
                  title="Hacé clic para seleccionar/deseleccionar esta financiación"
                >
                  <td className="p-3">{n}</td>
                  <td className="p-3">${total.toFixed(0)}</td>
                  <td className="p-3">${cuota.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 13.4) Mensaje inferior solicitado */}
        <p className="text-sm text-soft-text mt-2 text-center px-3 py-2">
          Selecciona una fila para incluir la cuota en el mensaje.
        </p>
      </section>

      {/* 14) CTA WhatsApp con mensaje armado */}
      <div className="mt-6 flex justify-center">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white"
          onClick={() => window.fbq && window.fbq("track", "Contact", { content_ids: [sku], content_type: "product" })}
        >
          <span>🟢</span> Consultar por WhatsApp
        </a>
      </div>
    </main>
  );
}
