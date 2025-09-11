import React from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "../lib/track";
import { WHATSAPP_PHONE, WA_PRESET_DEFAULT } from "../config/whatsapp";

export default function WhatsAppFloat({ phone = WHATSAPP_PHONE, preset = WA_PRESET_DEFAULT }) {
  const { pathname, search } = useLocation();

  const utm = "utm_source=qrtech-web&utm_medium=float&utm_campaign=wa_global";
  const base = preset
    ? `${preset}\n\n(${utm})`
    : `Hola QRTech! Quiero consultar sobre un producto.`;

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(base)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      onClick={() => trackWhatsAppClick({ name: "FloatWhatsApp", location: "float" })}
      className="fixed right-4 bottom-4 z-50 group"
    >
      <div className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 shadow-lg transition group-hover:shadow-xl active:scale-95">
        <MessageCircle className="w-5 h-5 text-white" aria-hidden="true" />
        <span className="hidden sm:block font-semibold text-white">WhatsApp</span>
      </div>
    </a>
  );
}
