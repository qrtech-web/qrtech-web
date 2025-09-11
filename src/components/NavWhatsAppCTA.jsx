// src/components/NavWhatsAppCTA.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";

export default function NavWhatsAppCTA({ className = "" }) {
  const { pathname, search } = useLocation();
  const utm = "utm_source=qrtech-web&utm_medium=navbar&utm_campaign=wa_global";
  const text = `Hola QRTech! Quiero consultar sobre un producto.`

  const href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick({ name: "NavWhatsApp", location: "navbar" })}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition ${className}`}
    >
      <MessageCircle className="w-4 h-4" aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}
