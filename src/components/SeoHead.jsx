// src/components/SeoHead.jsx
import { useEffect } from "react";

/**
 * Props:
 * - title, description, url
 * - image (opcional) → URL absoluta
 * - type (opcional) → "website" | "product" | ...
 * - schema (opcional) → JSON-LD
 * - imageWidth / imageHeight (opcional) → por defecto 1200x630
 */
export default function SeoHead({
  title,
  description,
  url,
  image,
  type = "website",
  schema,
  imageWidth = 1200,
  imageHeight = 630,
}) {
  useEffect(() => {
    if (title) document.title = title;

    setMeta({ name: "description", content: description });

    // Open Graph
    setMeta({ property: "og:title", content: title });
    setMeta({ property: "og:description", content: description });
    setMeta({ property: "og:type", content: type });
    setMeta({ property: "og:url", content: url });
    if (image) {
      setMeta({ property: "og:image", content: image });
      setMeta({ property: "og:image:width", content: String(imageWidth) });
      setMeta({ property: "og:image:height", content: String(imageHeight) });
    }

    // Twitter Card
    setMeta({ name: "twitter:card", content: image ? "summary_large_image" : "summary" });
    setMeta({ name: "twitter:title", content: title });
    setMeta({ name: "twitter:description", content: description });
    if (image) setMeta({ name: "twitter:image", content: image });

    // Canonical
    setLink({ rel: "canonical", href: url });

    // JSON-LD
    if (schema) {
      const id = "__qrtech_jsonld__";
      let script = document.getElementById(id);
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = id;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }
  }, [title, description, url, image, type, schema, imageWidth, imageHeight]);

  return null;
}

/* Helpers */
function setMeta(attrs) {
  const key = attrs.name ? ["name", attrs.name] : ["property", attrs.property];
  if (!key[1]) return;
  let el = document.head.querySelector(`meta[${key[0]}="${cssEscape(key[1])}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(key[0], key[1]);
    document.head.appendChild(el);
  }
  if (attrs.content != null) el.setAttribute("content", attrs.content);
}

function setLink(attrs) {
  if (!attrs.rel) return;
  let el = document.head.querySelector(`link[rel="${cssEscape(attrs.rel)}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", attrs.rel);
    document.head.appendChild(el);
  }
  if (attrs.href) el.setAttribute("href", attrs.href);
}

function cssEscape(str = "") {
  return String(str).replace(/"/g, '\\"');
}
