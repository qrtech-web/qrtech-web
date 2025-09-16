// src/components/CompareModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { WHATSAPP_PHONE } from "../config/whatsapp";

/**
 * Modal de comparación de 2 productos.
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - products: Array<{ id, nombre, imagen, precioUsd, variantes?: [...], specs?: { pantalla?, camaras?, chip?, peso?, dimensiones? } }>
 */
export default function CompareModal({ open, onClose, products = [] }) {
  // Estabiliza products
  const safeProducts = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  // Normaliza variantes y expone specs
  const normalized = useMemo(() => {
    return safeProducts.map((p) => {
      const variantes = Array.isArray(p.variantes) ? p.variantes : [];
      const storages = Array.from(new Set(variantes.map(v => v.storage).filter(Boolean)));
      const condiciones = Array.from(new Set(variantes.map(v => v.condicion).filter(Boolean)));
      const baterias = Array.from(new Set(variantes.map(v => v.bateria).filter(Boolean)));
      return { p, variantes, storages, condiciones, baterias };
    });
  }, [safeProducts]);

  // Selecciones por producto
  const [sel, setSel] = useState(() => {
    const init = {};
    for (const { p, storages, condiciones, baterias } of normalized) {
      init[p.id] = {
        storage: storages[0] || null,
        condicion: condiciones[0] || null,
        bateria: baterias[0] || null,
      };
    }
    return init;
  });

  useEffect(() => {
    if (!open) return;
    const next = {};
    for (const { p, storages, condiciones, baterias } of normalized) {
      next[p.id] = {
        storage: storages[0] || null,
        condicion: condiciones[0] || null,
        bateria: baterias[0] || null,
      };
    }
    setSel(next);
  }, [open, normalized]);

  // Scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Helpers
  const getVariant = (p, variantes) => {
    const s = sel[p.id] || {};
    let cand = variantes.slice();
    if (s.storage)   cand = cand.filter(v => v.storage === s.storage);
    if (s.condicion) cand = cand.filter(v => v.condicion === s.condicion);
    if (s.bateria)   cand = cand.filter(v => v.bateria === s.bateria);
    cand.sort((a,b) => (a.precioUsd ?? 1e9) - (b.precioUsd ?? 1e9));
    return cand[0] || null;
  };

  const buildWa = (p, variante) => {
    const desc = [
      variante?.storage ? `• ${variante.storage}` : null,
      variante?.condicion ? `• ${variante.condicion}` : null,
      variante?.bateria ? `• Batería ${variante.bateria}` : null,
    ].filter(Boolean).join(" ");
    const precio = variante?.precioUsd ?? p.precioUsd ?? 0;
    const lineas = [
      "¡Hola QRTech! 👋",
      `Quiero comparar y cotizar: ${p.nombre}`,
      desc || null,
      `• Precio USD ${precio}`,
    ].filter(Boolean);
    const text = encodeURIComponent(lineas.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE || "5493810000000"}?text=${text}`;
  };

  const parseBatteryPct = (s) => {
    if (!s) return null;
    const m = String(s).match(/(\d{2,3})/);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    if (!Number.isFinite(n)) return null;
    return Math.min(100, Math.max(0, n));
  };

  const avgBattery = (variantes) => {
    if (!Array.isArray(variantes) || variantes.length === 0) return null;
    const preferred = variantes.filter(v => v?.stock !== false);
    const base = preferred.length ? preferred : variantes;
    const vals = base.map(v => parseBatteryPct(v?.bateria)).filter(v => v != null);
    if (!vals.length) return null;
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    return `≈ ${avg}%`;
  };

  // Render
  if (!open || safeProducts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 top-10 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-slate-900 p-4 md:p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
          <h3 className="text-xl md:text-2xl font-bold">Comparar equipos</h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-sm"
            aria-label="Cerrar comparación"
          >
            Cerrar
          </button>
        </div>

        {/* Tabla */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="w-40 pr-3 text-white/70">Atributo</th>
                {normalized.map(({ p }) => (
                  <th key={p.id} className="min-w-[240px] px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imagen || "/img/placeholder.png"}
                        alt={p.nombre}
                        className="w-12 h-12 object-contain rounded-lg bg-white/5"
                        loading="lazy"
                      />
                      <div className="font-semibold text-base">{p.nombre}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="[&_td]:align-top">
              {/* Variante (selectores) */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Variante</td>
                {normalized.map(({ p, storages, condiciones, baterias }) => {
                  const s = sel[p.id] || {};
                  return (
                    <td key={p.id} className="py-3 px-3">
                      {storages.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[12px] opacity-80">Almacenamiento</div>
                          <select
                            value={s.storage || ""}
                            onChange={(e) => setSel((prev) => ({ ...prev, [p.id]: { ...prev[p.id], storage: e.target.value || null } }))}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.06] px-2 py-2"
                          >
                            {storages.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}
                      {condiciones.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[12px] opacity-80">Condición</div>
                          <select
                            value={s.condicion || ""}
                            onChange={(e) => setSel((prev) => ({ ...prev, [p.id]: { ...prev[p.id], condicion: e.target.value || null } }))}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.06] px-2 py-2"
                          >
                            {condiciones.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}
                      {baterias.length > 0 && (
                        <div>
                          <div className="text-[12px] opacity-80">Batería</div>
                          <select
                            value={s.bateria || ""}
                            onChange={(e) => setSel((prev) => ({ ...prev, [p.id]: { ...prev[p.id], bateria: e.target.value || null } }))}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.06] px-2 py-2"
                          >
                            {baterias.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}
                      {storages.length + condiciones.length + baterias.length === 0 && (
                        <div className="text-white/70">—</div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Precio USD */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Precio (USD)</td>
                {normalized.map(({ p, variantes }) => {
                  const v = variantes.length ? getVariant(p, variantes) : null;
                  const precio = v?.precioUsd ?? p.precioUsd ?? 0;
                  return (
                    <td key={p.id} className="py-3 px-3 font-semibold">
                      USD {precio}
                      {v?.stock === false && (
                        <div className="mt-1 text-[12px] text-amber-300">🟠 Stock bajo / sin disp.</div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Specs: Pantalla */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Pantalla</td>
                {normalized.map(({ p }) => (
                  <td key={p.id} className="py-3 px-3">{p.specs?.pantalla || "—"}</td>
                ))}
              </tr>

              {/* Specs: Cámaras */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Cámaras</td>
                {normalized.map(({ p }) => (
                  <td key={p.id} className="py-3 px-3">{p.specs?.camaras || "—"}</td>
                ))}
              </tr>

              {/* Specs: Chip */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Chip</td>
                {normalized.map(({ p }) => (
                  <td key={p.id} className="py-3 px-3">{p.specs?.chip || "—"}</td>
                ))}
              </tr>

              {/* Nueva: Batería (promedio variantes disponibles) */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Batería (promedio variantes disp.)</td>
                {normalized.map(({ variantes, p }) => (
                  <td key={p.id} className="py-3 px-3">
                    {avgBattery(variantes) || "—"}
                  </td>
                ))}
              </tr>

              {/* Nueva: Peso / Dimensiones */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Peso / Dimensiones</td>
                {normalized.map(({ p }) => (
                  <td key={p.id} className="py-3 px-3">
                    {(p.specs?.peso || "—")} · {(p.specs?.dimensiones || "—")}
                  </td>
                ))}
              </tr>

              {/* Confianza */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Confianza</td>
                {normalized.map(({ p }) => (
                  <td key={p.id} className="py-3 px-3 text-white/80">
                    ✓ Garantía escrita<br />
                    ✓ Retiro con cita en San Lorenzo 987
                  </td>
                ))}
              </tr>

              {/* CTA por columna */}
              <tr className="border-t border-white/10">
                <td className="py-3 pr-3 text-white/70">Acción</td>
                {normalized.map(({ p, variantes }) => {
                  const v = variantes.length ? getVariant(p, variantes) : null;
                  const href = buildWa(p, v);
                  return (
                    <td key={p.id} className="py-3 px-3">
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          try { window.gtag?.("event", "compare_cta_whatsapp", { item_id: p.id, variant_id: v?.id || null }); } catch {}
                          try { window.fbq?.("track", "Lead", { content_ids: [p.id], content_type: "product" }); } catch {}
                        }}
                        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 font-semibold text-white"
                      >
                        Consultar por WhatsApp
                      </a>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-white/60">
          Precios en USD de referencia. El total en ARS se calcula al tipo de cambio del día del pago.
        </p>
      </div>
    </div>
  );
}
