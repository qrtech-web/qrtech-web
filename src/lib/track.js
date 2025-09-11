// src/lib/track.js

// Opcional: en tu index.html podés definir window.QRTECH_PIXEL_ALIASES = ['ClickEnBoton','clickenboton'];
const PIXEL_ALIASES = (typeof window !== "undefined" && window.QRTECH_PIXEL_ALIASES) || [
  "ClickEnBoton",
  "clickenboton",
];

export function trackWhatsAppClick({ name, priceUsd, category = "iphone", location = "card" }) {
  const payload = {
    event: "whatsapp_click",
    name,
    priceUsd,
    category,
    location,
    timestamp: Date.now(),
  };

  // DataLayer (GTM / GA4)
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch (_) {}

  // GA4 directo (gtag)
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "whatsapp_click", {
        item_name: name,
        value: priceUsd,
        currency: "USD",
        location,
        item_category: category,
      });
    }
  } catch (_) {}

  // Meta Pixel (tu pixel existente + alias de eventos legacy)
  try {
    if (typeof window.fbq === "function") {
      // Nuestro evento estándar
      window.fbq("trackCustom", "WhatsAppClick", {
        content_name: name,
        value: priceUsd,
        currency: "USD",
        location,
        content_category: category,
      });

      // Dispara también tus nombres heredados (si los usabas)
      PIXEL_ALIASES.forEach((evt) => {
        window.fbq("trackCustom", evt, {
          content_name: name,
          value: priceUsd,
          currency: "USD",
          location,
          content_category: category,
        });
      });
    }
  } catch (_) {}
}
