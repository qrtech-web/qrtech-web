// src/components/WhatsAppFloat.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";

/**
 * Comportamiento:
 * - Siempre visible en desktop (≥ md).
 * - En mobile:
 *    • Oculto en /calculadora (ya hay barra fija con CTA).
 *    • Visible en el resto de las páginas.
 * - Pulse suave a los 8s de estar en una página (solo 1 vez por ruta).
 * - Mensaje prellenado con UTM que incluye la ubicación (pathname).
 */

export default function WhatsAppFloat() {
  const { pathname } = useLocation();
  const [pulse, setPulse] = useState(false);

  // Ocultar en mobile en /calculadora
  const isCalc = pathname.startsWith("/calculadora");

  // Mensaje y href
  const href = useMemo(() => {
    const base = "¡Hola QRTech! Quiero hacer una consulta.";
    const utm = `utm_source=qrtech-web&utm_medium=floating&utm_campaign=wa_float&utm_content=${encodeURIComponent(pathname)}`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`${base}\n\n${utm}`)}`;
  }, [pathname]);

  // Pulse suave automático a los 8s (por ruta)
  useEffect(() => {
    setPulse(false);
    const t = setTimeout(() => setPulse(true), 8000);
    const t2 = setTimeout(() => setPulse(false), 12000); // dura ~4s
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <div
      className={[
        "fixed right-4 bottom-4 z-50",
        // en mobile, esconder si estamos en calculadora (la barra fija ya tiene CTA)
        isCalc ? "hidden md:block" : "block",
      ].join(" ")}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick({ name: "Floating", priceUsd: 0, category: "general", location: "floating" })}
        className={[
          "inline-flex items-center gap-2 rounded-full px-4 py-3 font-semibold shadow-lg",
          "bg-emerald-600 hover:bg-emerald-700 text-white",
          "border border-white/10 backdrop-blur",
          "transition-transform",
          pulse ? "animate-[pulse_1.2s_ease-in-out_2]" : "",
        ].join(" ")}
        aria-label="Abrir WhatsApp"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.9 11.9 0 0012.02 0C5.4 0 .01 5.39.01 12c0 2.12.56 4.18 1.62 6L0 24l6.17-1.62a11.97 11.97 0 005.85 1.5h.01c6.62 0 12.01-5.39 12.01-12 0-3.2-1.25-6.2-3.54-8.4zM12.03 21.5h-.01a9.9 9.9 0 01-5.04-1.38l-.36-.21-3.66.96.98-3.56-.24-.37A9.95 9.95 0 012.12 12C2.12 6.57 6.6 2.1 12.03 2.1c2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 012.93 6.98c0 5.43-4.47 9.52-9.91 9.52zm5.7-7.37c-.31-.16-1.83-.9-2.11-1.01-.28-.1-.49-.15-.7.16-.2.31-.8 1.01-.98 1.22-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.02-.54-.08-.16-.7-1.69-.96-2.31-.25-.6-.51-.52-.7-.53l-.6-.01c-.21 0-.54.08-.82.39-.28.31-1.07 1.05-1.07 2.56 0 1.51 1.09 2.97 1.24 3.18.15.21 2.14 3.27 5.19 4.59.73.32 1.3.51 1.73.65.73.23 1.39.2 1.91.12.58-.09 1.83-.75 2.09-1.47.26-.72.26-1.33.18-1.47-.08-.14-.28-.23-.59-.39z" />
        </svg>
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
