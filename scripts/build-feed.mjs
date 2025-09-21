// scripts/build-feed.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** 1) Config: origen absoluto del sitio para armar links e imágenes */
const SITE = process.env.SITE_ORIGIN || "https://qrtech.com.ar";

/** 2) Cargar productos fuente */
const src = resolve(__dirname, "../src/data/productos.json");
const data = JSON.parse(readFileSync(src, "utf8"));

/** 3) Helpers */
const isAbs = (p) => typeof p === "string" && /^https?:\/\//i.test(p);
const abs = (p) => (p ? (isAbs(p) ? p : SITE + p) : "");
const toUSD = (n) => `${Number(n || 0).toFixed(2)} USD`;
const condToMeta = (c) => (/sellado/i.test(String(c)) ? "new" : "used");
const avail = (v) => (v?.stock === false ? "out of stock" : "in stock");
const sanitize = (s) =>
  String(s ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const csvRow = (cols) =>
  cols
    .map((c) => `"${sanitize(c).replace(/"/g, '""')}"`)
    .join(",");

/** 4) Aplanar variantes -> items individuales */
const items = [];
for (const p of data) {
  const base = {
    item_group_id: p.id, // agrupa variantes bajo el mismo modelo
    brand: p.marca || "Apple",
    link: `${SITE}/productos?sku=${encodeURIComponent(p.id)}`,
    google_product_category: "Móviles y accesorios > Teléfonos móviles", // opcional
  };

  const baseGeneralImg = abs(p.imagen || p.imagenes?.[0] || "/img/placeholder.png");
  const baseAdditional = (p.imagenes || []).slice(1).map(abs).join(",");

  if (Array.isArray(p.variantes) && p.variantes.length) {
    for (const v of p.variantes) {
      const precio = v.precioUsd ?? p.precioUsd;
      if (!precio) continue;

      // Imagen principal por color (si existe), si no la general
      let image_link = baseGeneralImg;
      let additional_image_link = baseAdditional;

      if (v.color && p.imagenesPorColor && Array.isArray(p.imagenesPorColor[v.color])) {
        const arr = p.imagenesPorColor[v.color].filter(Boolean);
        if (arr.length) {
          image_link = abs(arr[0]);
          // Si hay más fotos del mismo color, úsalas como adicionales
          const extras = arr.slice(1).map(abs);
          // Si no hay extras por color, conserva las generales
          additional_image_link = extras.length ? extras.join(",") : baseAdditional;
        }
      }

      items.push({
        id:
          v.id ||
          `${p.id}-${(v.storage || "").replace(/\s/g, "")}-${(v.condicion || "").replace(/\s/g, "")}-${(v.bateria || "").replace(/\s/g, "")}`,
        title: `${p.nombre} ${v.storage || ""} ${v.condicion || ""}`.trim(),
        description: `${p.nombre} ${v.storage || ""} · ${v.condicion || ""}${
          v.bateria ? ` · Batería ${v.bateria}` : ""
        }. Garantía QRTech.`,
        availability: avail(v),
        condition: condToMeta(v.condicion || p.condicion || ""),
        price: toUSD(precio),
        color: v.color || "",
        size: v.storage || "", // usamos storage como “size”
        custom_label_0: v.bateria || "",
        link: base.link,
        image_link,
        additional_image_link,
        brand: base.brand,
        item_group_id: base.item_group_id,
        google_product_category: base.google_product_category,
      });
    }
  } else {
    // sin variantes → un único ítem (id debe matchear el content_id del píxel)
    if (!p.precioUsd) continue;

    items.push({
      id: p.id, // coincide con el píxel cuando no hay variantes
      title: p.nombre,
      description: `${p.nombre} · Garantía QRTech.`,
      availability: "in stock",
      condition: condToMeta(p.condicion || ""),
      price: toUSD(p.precioUsd),
      color: "",
      size: "",
      custom_label_0: "",
      link: base.link,
      image_link: baseGeneralImg,
      additional_image_link: baseAdditional,
      brand: base.brand,
      item_group_id: base.item_group_id,
      google_product_category: base.google_product_category,
    });
  }
}

/** 5) Salidas (JSON + CSV) */
const outDir = resolve(__dirname, "../public");
mkdirSync(outDir, { recursive: true });

writeFileSync(resolve(outDir, "products-feed.json"), JSON.stringify(items, null, 2), "utf8");

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
  "google_product_category",
];

const csv = [
  headers.join(","),
  ...items.map((it) => csvRow(headers.map((h) => it[h] ?? ""))),
].join("\n");

writeFileSync(resolve(outDir, "products-feed.csv"), csv + "\n", "utf8");

console.log(`OK -> ${items.length} items`);
