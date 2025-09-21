// src/components/VariantSelector.jsx
import React, { useEffect, useMemo, useState } from "react";

/** Elige la mejor variante disponible según storage/condición/batería/color.
 *  Si condicion === "Sellado", fuerza batería = "100%".
 */
function pickVariant(product, { storage, condicion, bateria, color }) {
  if (!product?.variantes?.length) return null;
  const wantBateria = condicion === "Sellado" ? "100%" : bateria;

  // 1) Coincidencia exacta
  let v = product.variantes.find(x =>
    (!storage   || x.storage   === storage)   &&
    (!condicion || x.condicion === condicion) &&
    (!wantBateria || x.bateria === wantBateria) &&
    (!color     || x.color     === color)
  );
  if (v) return v;

  // 2) Relajar por batería (respetando storage/condición/color)
  v = product.variantes.find(x =>
    (!storage   || x.storage   === storage)   &&
    (!condicion || x.condicion === condicion) &&
    (!color     || x.color     === color)
  );
  if (v) return v;

  // 3) Relajar por color (si no encontramos exacto por color)
  v = product.variantes.find(x =>
    (!storage   || x.storage   === storage) &&
    (!condicion || x.condicion === condicion)
  );
  if (v) return v;

  // 4) Fallback
  return product.variantes[0] || null;
}

/**
 * props:
 *  - product: {
 *      imagenesPorColor?: { [color: string]: string[] },
 *      variantes?: Array<{id, storage, condicion, bateria, precioUsd, stock, color?}>
 *    }
 *  - onChange: (variant|null) => void
 */
export default function VariantSelector({ product, onChange }) {
  /** ===== Derivados de datos ===== */
  const variantes = useMemo(
    () => (Array.isArray(product?.variantes) ? product.variantes : []),
    [product?.variantes]
  );

  const storages = useMemo(
    () => Array.from(new Set(variantes.map(v => v.storage).filter(Boolean))),
    [variantes]
  );
  const condiciones = useMemo(
    () => Array.from(new Set(variantes.map(v => v.condicion).filter(Boolean))),
    [variantes]
  );
  const bateriasAll = useMemo(
    () => Array.from(new Set(variantes.map(v => v.bateria).filter(Boolean))),
    [variantes]
  );
  const colores = useMemo(() => {
    // Preferimos los colores declarados en variantes; si no, usamos las claves de imagenesPorColor
    const fromVar = new Set(variantes.map(v => v.color).filter(Boolean));
    const fromImgs = product?.imagenesPorColor ? Object.keys(product.imagenesPorColor) : [];
    fromImgs.forEach(c => fromVar.add(c));
    return Array.from(fromVar);
  }, [variantes, product?.imagenesPorColor]);

  /** ===== Estado de selección ===== */
  const [storage, setStorage]     = useState(storages[0] || null);
  const [condicion, setCondicion] = useState(condiciones[0] || null);
  const [bateria, setBateria]     = useState(bateriasAll[0] || null);
  const [color, setColor]         = useState(colores[0] || null);

  // Reset de selección cuando cambia el producto / opciones base
  useEffect(() => {
    const s = storages[0] || null;
    const c = condiciones[0] || null;
    const b = c === "Sellado" ? "100%" : (bateriasAll[0] || null);
    const col = colores[0] || null;
    setStorage(s);
    setCondicion(c);
    setBateria(b);
    setColor(col);
    onChange?.(pickVariant(product, { storage: s, condicion: c, bateria: b, color: col }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, storages, condiciones, bateriasAll, colores]);

  /** ===== Reglas de negocio / opciones visibles ===== */

  // Si el usuario pone Sellado, fijamos batería 100% y notificamos variante correcta
  useEffect(() => {
    if (condicion === "Sellado" && bateria !== "100%") {
      const b = "100%";
      setBateria(b);
      onChange?.(pickVariant(product, { storage, condicion: "Sellado", bateria: b, color }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condicion]);

  // Baterías disponibles según el combo actual (storage + condicion + color)
  const bateriasDisponibles = useMemo(() => {
    if (!variantes.length) return new Set();
    const list = variantes
      .filter(v =>
        (!storage   || v.storage   === storage) &&
        (!condicion || v.condicion === condicion) &&
        (!color     || v.color     === color)
      )
      .map(v => v.bateria || "100%");
    return new Set(list);
  }, [variantes, storage, condicion, color]);

  // Si es Sellado, solo mostramos 100%; en usados, mostrá las que efectivamente existen
  const opcionesBateria = useMemo(() => {
    if (condicion === "Sellado") return ["100%"];
    const order = ["≥85%", "≥90%", "100%"];
    const byExistence = order.filter(x => bateriasDisponibles.has(x));
    const extras = [...bateriasDisponibles].filter(x => !byExistence.includes(x));
    return [...byExistence, ...extras];
  }, [condicion, bateriasDisponibles]);

  /** ===== Variante efectiva y notificación ===== */
  const varianteSel = useMemo(
    () => pickVariant(product, { storage, condicion, bateria, color }),
    [product, storage, condicion, bateria, color]
  );

  useEffect(() => {
    onChange?.(varianteSel || null);
  }, [varianteSel, onChange]);

  /** ===== UI ===== */
  const ChipGroup = ({ label, value, items, onSelect, disabledSet }) => {
    if (!items?.length) return null;
    return (
      <div className="mb-3">
        <div className="mb-1 text-sm opacity-80">{label}</div>
        <div className="flex flex-wrap gap-2">
          {items.map((opt) => {
            const disabled = disabledSet?.has && disabledSet.has(opt);
            const active = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => !disabled && onSelect(opt)}
                disabled={!!disabled}
                className={[
                  "rounded-full px-3.5 py-1.5 text-sm border transition",
                  active
                    ? "bg-emerald-600/20 border-emerald-400/40 text-emerald-100"
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                  disabled ? "opacity-40 cursor-not-allowed hover:bg-white/5" : ""
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="mt-3">
      {/* Color primero, así la imagen (próximo paso) puede cambiar apenas el usuario lo elige */}
      <ChipGroup
        label="Color"
        value={color}
        items={colores}
        onSelect={(opt) => {
          setColor(opt);
          const b = condicion === "Sellado" ? "100%" : bateria;
          onChange?.(pickVariant(product, { storage, condicion, bateria: b, color: opt }));
        }}
      />

      <ChipGroup
        label="Almacenamiento"
        value={storage}
        items={storages}
        onSelect={(opt) => {
          setStorage(opt);
          const b = condicion === "Sellado" ? "100%" : bateria;
          onChange?.(pickVariant(product, { storage: opt, condicion, bateria: b, color }));
        }}
      />

      <ChipGroup
        label="Condición"
        value={condicion}
        items={condiciones}
        onSelect={(opt) => {
          setCondicion(opt);
          const b = opt === "Sellado" ? "100%" : bateria;
          setBateria(b);
          onChange?.(pickVariant(product, { storage, condicion: opt, bateria: b, color }));
        }}
      />

      <ChipGroup
        label="Batería"
        value={bateria}
        items={opcionesBateria}
        disabledSet={condicion === "Sellado" ? new Set() : new Set([...opcionesBateria].filter(x => !bateriasDisponibles.has(x)))}
        onSelect={(opt) => {
          setBateria(opt);
          onChange?.(pickVariant(product, { storage, condicion, bateria: opt, color }));
        }}
      />

      {varianteSel && varianteSel.stock === false && (
        <p className="mt-2 text-xs text-amber-300">🟠 Stock bajo o sin disponibilidad. Consultá por alternativas.</p>
      )}
    </section>
  );
}
