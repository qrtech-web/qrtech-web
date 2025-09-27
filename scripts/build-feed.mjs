// scripts/build-feed.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Dominio absoluto para construir URLs de imágenes y enlaces del feed.
 * Cambiá el valor por defecto o pasalo por ENV al ejecutar:
 *   SITE_ORIGIN=https://tu-dominio.com node scripts/build-feed.mjs
 */
const SITE = process.env.SITE_ORIGIN || "https://qrtech.com.ar";

// 1) Cargar productos fuente
const src = resolve(__dirname, "../src/data/productos.json");
const data = JSON.parse(readFileSync(src, "utf8"));

// 2) Helpers
const toAbs = (p) => (p?.startsWith("http") ? p : SITE + (p?.startsWith("/") ? p : "/" + p || ""));
const encUrl = (u) => toAbs(u).replace(/ /g, "%20"); // espacios -> %20
const priceOf = (v, p) => Number(v?.precioUsd ?? p?.precioUsd);
const condToMeta = (c = "") => (/sellado/i.test(c) ? "new" : "used");
const avail = (v) => (v?.stock === false ? "out of stock" : "in stock");
const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

// ID único si la variante no trae id (incluye color para evitar choques)
const makeId = (p, v) =>
  v?.id || `${p.id}-${norm(v?.storage)}-${norm(v?.condicion)}-${norm(v?.bateria)}-${norm(v?.color) || "nocolor"}`;

// 3) Aplanar productos -> items (Meta recomienda 1 item por variante)
const items = [];
for (const p of data) {
  const base = {
    item_group_id: p.id,
    brand: p.marca || "Apple",
    link: `${SITE}/productos?sku=${encodeURIComponent(p.id)}`,
    image_link: encUrl(p.imagen || p.imagenes?.[0] || "/img/placeholder.png"),
    additional_image_link: (p.imagenes || []).slice(1).map(encUrl).join(","),
    google_product_category: "Móviles y accesorios > Teléfonos móviles",
  };

  if (Array.isArray(p.variantes) && p.variantes.length) {
    for (const v of p.variantes) {
      const px = priceOf(v, p);
      if (!Number.isFinite(px)) continue; // sin precio => no lo emitas

      items.push({
        id: makeId(p, v),
        title: `${p.nombre} ${v.storage || ""} ${v.condicion || ""}`.trim(),
        description: `${p.nombre}${v.storage ? ` ${v.storage}` : ""}${v.condicion ? ` · ${v.condicion}` : ""}${
          v.bateria ? ` · Batería ${v.bateria}` : ""
        }. Garantía QRTech.`,
        availability: avail(v),
        condition: condToMeta(v.condicion || p.condicion),
        price: `${px.toFixed(2)} USD`,
        color: v.color || "",
        size: v.storage || "",
        custom_label_0: v.bateria || "",
        ...base,
      });
    }
  } else {
    const px = priceOf(null, p);
    if (!Number.isFinite(px)) continue;

    items.push({
      id: p.catalogId || p.id,
      title: p.nombre,
      description: `${p.nombre} · Garantía QRTech.`,
      availability: "in stock",
      condition: condToMeta(p.condicion),
      price: `${px.toFixed(2)} USD`,
      color: "",
      size: "",
      custom_label_0: "",
      ...base,
    });
  }
}

// 4) Salidas en /public
const outDir = resolve(__dirname, "../public");
mkdirSync(outDir, { recursive: true });

// JSON
writeFileSync(resolve(outDir, "products-feed.json"), JSON.stringify(items, null, 2), "utf8");

// CSV estándar Meta
const headers = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "additional_image_link",
  "brand",
  "item_group_id",
  "color",
  "size",
  "custom_label_0",
];

const csv = [
  headers.join(","),
  ...items.map((it) => headers.map((h) => `"${String(it[h] ?? "").replace(/"/g, '""')}"`).join(",")),
].join("\n");

writeFileSync(resolve(outDir, "products-feed.csv"), csv, "utf8");

console.log(`Feed OK → ${items.length} items
JSON: /public/products-feed.json
CSV : /public/products-feed.csv
SITE_ORIGIN=${SITE}`);
 