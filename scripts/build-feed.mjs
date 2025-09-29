// scripts/build-feed.mjs
// Genera /public/products-feed.csv y /public/products-feed.json desde src/data/productos.json
// Si existe la carpeta /build (CRA), duplica los archivos allí para que el hosting los sirva tras el build.
// Uso: cross-env SITE_ORIGIN=https://qrtech.com.ar node scripts/build-feed.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ====== Config ======
const SITE = process.env.SITE_ORIGIN || "https://qrtech.com.ar";
const CANON = new URL(SITE);

// ====== Utils ======
const normalizePathname = (pathname) => {
  let p = pathname.replace(/%2F/gi, "/").replace(/\/{2,}/g, "/");
  p = p
    .replace(/\/img\/productos\/android\//g, "/img/productos/Android/")
    .replace(/\/img\/productos\/accesorios\//g, "/img/productos/Accesorios/")
    .replace(/\/img\/productos\/Iphone\//g, "/img/productos/iPhone/")
    .replace(/\/img\/productos\/Android\/xiaomi\//g, "/img/productos/Android/Xiaomi/")
    .replace(/\/img\/productos\/Android\/samsung\//g, "/img/productos/Android/Samsung/");
  if (!p.startsWith("/")) p = "/" + p;
  return p;
};

const toAbsImg = (input) => {
  let u = String(input || "").trim();
  if (!u) u = "/img/placeholder.png";
  if (/^http:\/\//i.test(u)) u = u.replace(/^http:\/\//i, "https://");

  let url;
  if (/^https?:\/\//i.test(u)) {
    url = new URL(u);
    url.pathname = normalizePathname(url.pathname);
  } else {
    url = new URL(normalizePathname(u), CANON);
  }
  url.host = CANON.host;
  url.protocol = "https:";
  return encodeURI(url.toString());
};

const toAbsLink = (path) => {
  const p = String(path || "/").startsWith("/") ? path : `/${path || ""}`;
  const u = new URL(p, CANON);
  u.host = CANON.host;
  u.protocol = "https:";
  return u.toString();
};

const priceOf = (v, p) => Number(v?.precioUsd ?? p?.precioUsd);
const condToMeta = (c = "") => (/^(nuevo|sellado)/i.test(c) ? "new" : "used");
const availability = (v) => (v?.stock === false ? "out of stock" : "in stock");
const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
const makeId = (p, v) =>
  v?.id ||
  `${p.id}-${norm(v?.storage) || "nostorage"}-${norm(v?.condicion) || "nocond"}-${norm(v?.bateria) || "nobatt"}-${
    norm(v?.color) || "nocolor"
  }`;

// ====== Carga ======
const src = resolve(__dirname, "../src/data/productos.json");
const data = JSON.parse(readFileSync(src, "utf8"));

// ====== Transform ======
const resolveImages = (p, v) => {
  const main = toAbsImg(p.imagen || p.imagenes?.[0] || "/img/placeholder.png");

  let colorImg = null;
  if (v?.color && p.imagenesPorColor && Array.isArray(p.imagenesPorColor[v.color])) {
    const arr = p.imagenesPorColor[v.color];
    if (arr.length) colorImg = toAbsImg(arr[0]);
  }

  const image_link = colorImg || main;

  const additional = (Array.isArray(p.imagenes) ? p.imagenes.slice(0) : [])
    .filter(Boolean)
    .map((x) => toAbsImg(x))
    .filter((u) => u !== image_link);

  return { image_link, additional_image_link: additional.join(",") };
};

const items = [];
for (const p of data) {
  const base = {
    item_group_id: p.id,
    brand: p.marca || "QRTech",
    link: toAbsLink(`/productos?sku=${encodeURIComponent(p.id)}`),
    google_product_category: "Móviles y accesorios > Teléfonos móviles",
  };

  if (Array.isArray(p.variantes) && p.variantes.length) {
    for (const v of p.variantes) {
      const px = priceOf(v, p);
      if (!Number.isFinite(px)) continue;
      const { image_link, additional_image_link } = resolveImages(p, v);

      const titleBits = [p.nombre, v.storage, v.condicion].filter(Boolean);
      const title = titleBits.join(" ").trim();

      const descBits = [
        p.nombre,
        v.storage ? `${v.storage}` : "",
        v.condicion ? `· ${v.condicion}` : "",
        v.bateria ? `· Batería ${v.bateria}` : "",
        "· Garantía QRTech.",
      ].filter(Boolean);
      const description = descBits.join(" ").replace(/\s{2,}/g, " ").trim();

      items.push({
        id: makeId(p, v),
        title,
        description,
        availability: availability(v),
        condition: condToMeta(v.condicion || p.condicion),
        price: `${px.toFixed(2)} USD`,
        color: v.color || "",
        size: v.storage || "",
        custom_label_0: v.bateria || "",
        image_link,
        additional_image_link,
        ...base,
      });
    }
  } else {
    const px = priceOf(null, p);
    if (!Number.isFinite(px)) continue;
    const { image_link, additional_image_link } = resolveImages(p, null);

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
      image_link,
      additional_image_link,
      ...base,
    });
  }
}

// ====== Salidas ======
const outPublic = resolve(__dirname, "../public");
mkdirSync(outPublic, { recursive: true });

const jsonPath = resolve(outPublic, "products-feed.json");
const csvPath  = resolve(outPublic, "products-feed.csv");

writeFileSync(jsonPath, JSON.stringify(items, null, 2), "utf8");

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

const escapeCSV = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv = [headers.join(","), ...items.map((it) => headers.map((h) => escapeCSV(it[h])).join(","))].join("\n");
writeFileSync(csvPath, csv, "utf8");

// Copia opcional a /build (si existe) para que el feed quede publicado tras el build de CRA
const buildDir = resolve(__dirname, "../build");
if (existsSync(buildDir)) {
  const buildJson = resolve(buildDir, "products-feed.json");
  const buildCsv = resolve(buildDir, "products-feed.csv");
  try {
    cpSync(jsonPath, buildJson, { force: true });
    cpSync(csvPath, buildCsv, { force: true });
    console.log("También copiado a /build (post-build CRA).");
  } catch (e) {
    console.warn("No se pudo copiar a /build:", e.message);
  }
}

console.log(`Feed OK → ${items.length} items
JSON: ${jsonPath}
CSV : ${csvPath}
SITE_ORIGIN=${SITE}`);
