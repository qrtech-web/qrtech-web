// src/lib/track.js
// Helpers para Meta Pixel y GA4

// Normaliza IDs de variante: "...-a80as" → "...-a80"
export function catalogIdForPixel(rawId) {
  if (!rawId) return null;
  const s = String(rawId);
  const m = s.match(/^(.*-a\d{2,3})[a-z]+$/i);
  return m ? m[1] : s;
}

// No trackear en localhost y sólo si fbq existe
export function shouldTrack() {
  if (typeof window === 'undefined') return false;
  const host = window.location?.hostname || '';
  if (/^(localhost|127\.0\.0\.1)$/i.test(host)) return false;
  return typeof window.fbq === 'function';
}

// ViewContent alineado al feed
export function trackViewContent({ id, name, priceUsd }) {
  try {
    if (!shouldTrack()) return;
    const cid = catalogIdForPixel(id);
    if (!cid) return;
    window.fbq('track', 'ViewContent', {
      content_ids: [cid],
      content_type: 'product',
      value: Number(priceUsd || 0),
      currency: 'USD',
      item_name: name,
    });
  } catch (_) {}
}

// Aliases opcionales (eventos viejos)
const PIXEL_ALIASES =
  (typeof window !== 'undefined' && window.QRTECH_PIXEL_ALIASES) || [
    'ClickEnBoton',
    'clickenboton',
  ];

// Click en WhatsApp con señales GA4 + Meta Pixel
export function trackWhatsAppClick({
  id,
  name,
  priceUsd,
  category = 'iphone',
  location = 'card',
}) {
  const valueNum = Number(priceUsd || 0);

  // DataLayer (para GTM/GA4)
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_click',
      name,
      value: valueNum,
      currency: 'USD',
      location,
      item_category: category,
      timestamp: Date.now(),
    });
  } catch (_) {}

  // GA4 directo
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'whatsapp_click', {
        item_name: name,
        value: valueNum,
        currency: 'USD',
        location,
        item_category: category,
      });
    }
  } catch (_) {}

  // Meta Pixel
  try {
    if (!shouldTrack()) return;

    // Evento custom (compatibilidad)
    window.fbq('trackCustom', 'WhatsAppClick', {
      content_name: name,
      value: valueNum,
      currency: 'USD',
      location,
      content_category: category,
    });

    // Eventos estándar (Lead + Contact)
    const cid = catalogIdForPixel(id);
    const metaPayload = {
      ...(cid ? { content_ids: [cid] } : {}),
      content_type: 'product',
      value: valueNum,
      currency: 'USD',
      item_name: name,
      location,
    };
    window.fbq('track', 'Contact', metaPayload);
    window.fbq('track', 'Lead', metaPayload);

    // Aliases heredados
    PIXEL_ALIASES.forEach((evt) => {
      window.fbq('trackCustom', evt, {
        content_name: name,
        value: valueNum,
        currency: 'USD',
        location,
        content_category: category,
      });
    });
  } catch (_) {}
}
