// scripts/build-feed.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 1) Config: origen absoluto del sitio para armar links e imágenes
const SITE = process.env.SITE_ORIGIN || "https://qrtech.com.ar";

// 2) Cargar productos fuente
const src = resolve(__dirname, "../src/data/productos.json");
const data = JSON.parse(readFileSync(src, "utf8"));

// 3) Helpers
const abs = (p) => (p?.startsWith("http") ? p : SITE + p);
const toUSD = (n) => `${Number(n || 0).toFixed(2)} USD`;
const condToMeta = (c) => (/sellado/i.test(c) ? "new" : "used");
const avail = (v) => (v?.stock === false ? "out of stock" : "in stock");

// 4) Aplanar variantes -> items individuales (Meta recomienda 1 ítem por variante)
const items = [];
for (const p of data) {
  const base = {
    item_group_id: p.id,                   // agrupa variantes
    brand: p.marca || "Apple",
    link: `${SITE}/productos?sku=${encodeURIComponent(p.id)}`,
    image_link: abs(p.imagen || p.imagenes?.[0] || "/img/placeholder.png"),
    additional_image_link: (p.imagenes || [])
      .slice(1)
      .map(abs)
      .join(","),
    google_product_category: "Móviles y accesorios > Teléfonos móviles", // opcional
  };

  if (Array.isArray(p.variantes) && p.variantes.length) {
    for (const v of p.variantes) {
      items.push({
        id: v.id || `${p.id}-${(v.storage || "").replace(/\s/g, "")}-${(v.condicion || "").replace(/\s/g, "")}-${(v.bateria || "").replace(/\s/g, "")}`,
        title: `${p.nombre} ${v.storage || ""} ${v.condicion || ""}`.trim(),
        description: `${p.nombre} ${v.storage || ""} · ${v.condicion || ""}${v.bateria ? ` · Batería ${v.bateria}` : ""}. Garantía QRTech.`,
        availability: avail(v),
        condition: condToMeta(v.condicion || p.condicion || ""),
        price: toUSD(v.precioUsd ?? p.precioUsd),
        color: v.color || "",                 // si cargás color, queda listo
        size: v.storage || "",                // storage como “size”
        custom_label_0: v.bateria || "",      // batería visible en catálogo
        ...base,
      });
    }
  } else {
    // sin variantes → un único ítem
    items.push({
      id: p.catalogId || p.id,
      title: p.nombre,
      description: `${p.nombre} · Garantía QRTech.`,
      availability: "in stock",
      condition: condToMeta(p.condicion || ""),
      price: toUSD(p.precioUsd),
      color: "",
      size: "",
      custom_label_0: "",
      ...base,
    });
  }
}

// 5) Salidas
const outDir = resolve(__dirname, "../public");
mkdirSync(outDir, { recursive: true });

writeFileSync(resolve(outDir, "products-feed.json"), JSON.stringify(items, null, 2), "utf8");

// CSV estándar para Meta
const headers = [
  "id","title","description","availability","condition","price",
  "link","image_link","additional_image_link","brand","item_group_id",
  "color","size","custom_label_0"
];
const csv = [
  headers.join(","),
  ...items.map(it =>
    headers.map(h => `"${String(it[h] ?? "").replace(/"/g, '""')}"`).join(",")
  ),
].join("\n");
writeFileSync(resolve(outDir, "products-feed.csv"), csv, "utf8");

console.log(`OK -> ${items.length} items`);
