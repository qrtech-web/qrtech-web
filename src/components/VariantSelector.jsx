// src/components/VariantSelector.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * props:
 *  - product: { variantes?: Array<{id, storage, condicion, bateria, precioUsd, stock}> }
 *  - onChange: (variant|null) => void
 */
export default function VariantSelector({ product, onChange }) {
  // 1) Memo: estabiliza el array de variantes (evita que cambie identidad cada render)
  const variantes = useMemo(
    () => (Array.isArray(product?.variantes) ? product.variantes : []),
    [product?.variantes]
  );

  // 2) Memo: opciones únicas por eje derivadas de 'variantes'
  const storages = useMemo(
    () => Array.from(new Set(variantes.map(v => v.storage).filter(Boolean))),
    [variantes]
  );
  const condiciones = useMemo(
    () => Array.from(new Set(variantes.map(v => v.condicion).filter(Boolean))),
    [variantes]
  );
  const baterias = useMemo(
    () => Array.from(new Set(variantes.map(v => v.bateria).filter(Boolean))),
    [variantes]
  );

  // 3) Estado de selección (inicia en la primera opción disponible)
  const [storage, setStorage] = useState(storages[0] || null);
  const [condicion, setCondicion] = useState(condiciones[0] || null);
  const [bateria, setBateria] = useState(baterias[0] || null);

  // 4) Reset de selección cuando cambian las opciones o el producto
  useEffect(() => {
    setStorage(storages[0] || null);
    setCondicion(condiciones[0] || null);
    setBateria(baterias[0] || null);
  }, [product?.id, storages, condiciones, baterias]);

  // 5) Cálculo de la variante matcheada (la más barata dentro del filtro actual)
  const varianteSel = useMemo(() => {
    if (!variantes.length) return null;
    let cand = variantes;
    if (storage)   cand = cand.filter(v => v.storage === storage);
    if (condicion) cand = cand.filter(v => v.condicion === condicion);
    if (bateria)   cand = cand.filter(v => v.bateria === bateria);
    return cand.slice().sort((a, b) => (a.precioUsd ?? 1e9) - (b.precioUsd ?? 1e9))[0] || null;
  }, [variantes, storage, condicion, bateria]);

  // 6) Notifica al padre cuando cambia la variante seleccionada
  useEffect(() => {
    onChange?.(varianteSel);
  }, [varianteSel, onChange]);

  // 7) UI de chips reutilizable
  const ChipGroup = ({ label, value, setValue, items }) => {
    if (!items?.length) return null;
    return (
      <div className="mb-3">
        <div className="mb-1 text-sm opacity-80">{label}</div>
        <div className="flex flex-wrap gap-2">
          {items.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue(opt)}
              className={[
                "rounded-full px-3.5 py-1.5 text-sm border transition",
                value === opt
                  ? "bg-emerald-600/20 border-emerald-400/40 text-emerald-100"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              ].join(" ")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="mt-3">
      <ChipGroup label="Almacenamiento" value={storage} setValue={setStorage} items={storages} />
      <ChipGroup label="Condición"      value={condicion} setValue={setCondicion} items={condiciones} />
      <ChipGroup label="Batería"        value={bateria} setValue={setBateria} items={baterias} />
      {varianteSel && varianteSel.stock === false && (
        <p className="mt-2 text-xs text-amber-300">🟠 Stock bajo o sin disponibilidad. Consultá por alternativas.</p>
      )}
    </section>
  );
}
