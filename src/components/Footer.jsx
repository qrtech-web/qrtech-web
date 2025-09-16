// src/components/Footer.jsx
import { MapPinIcon, ShieldCheckIcon, CreditCardIcon, PhoneIcon, ClockIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { WHATSAPP_PHONE } from "../config/whatsapp";
import { trackWhatsAppClick } from "../lib/track";

function waHref(text, utm = "utm_source=qrtech-web&utm_medium=footer&utm_campaign=wa_footer") {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`${text}\n`)}`;
}

export default function Footer() {
  const hrefWA = waHref("¡Hola QRTech! Quiero coordinar una visita o hacer una consulta.");

  return (
    <footer className="bg-gray-950 text-gray-200 border-t border-white/10">
      {/* top */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: Contacto */}
          <div>
            <h3 className="text-lg font-semibold">Contacto</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-5 h-5 text-sky-300 mt-0.5" />
                <span>San Lorenzo 987 — San Miguel de Tucumán</span>
              </li>
              <li className="flex items-start gap-2">
                <ClockIcon className="w-5 h-5 text-amber-300 mt-0.5" />
                <span>Atención con cita previa</span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneIcon className="w-5 h-5 text-emerald-300 mt-0.5" />
                <a
                  href={hrefWA}
                  onClick={() => trackWhatsAppClick({ name: "Footer", priceUsd: 0, category: "info", location: "footer" })}
                  className="underline underline-offset-2 hover:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>

            <a
              href={hrefWA}
              onClick={() => trackWhatsAppClick({ name: "Footer CTA", priceUsd: 0, category: "info", location: "footer-cta" })}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600/90 hover:bg-green-600 px-4 py-2 text-sm font-medium"
            >
              Consultar por WhatsApp <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Col 2: Medios de pago */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-amber-300" />
              Medios de pago
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Efectivo y transferencia</li>
              <li>• Tarjetas (1, 2, 3, 6, 9 y 12 cuotas)</li>
              <li>• Mercado Pago</li>
            </ul>
            <p className="mt-3 text-xs text-gray-400">
              Los valores en cuotas son estimados. Confirmamos el plan al coordinar por WhatsApp.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-300">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>Garantía QRTech escrita</span>
            </div>
          </div>

          {/* Col 3: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold">Enlaces</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="/productos" className="hover:text-white">Catálogo</a>
              </li>
              <li>
                <a href="/calculadora" className="hover:text-white">Calculadora</a>
              </li>
              <li>
                <a href="/inicio#como-comprar" className="hover:text-white">Cómo comprar</a>
              </li>
              <li>
                <a href="/inicio#plan-canje" className="hover:text-white">Plan canje</a>
              </li>
              <li>
                <a href="/inicio#faq" className="hover:text-white">Preguntas frecuentes</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
          <iframe
            title="Mapa QRTech"
            src="https://www.google.com/maps?q=San+Lorenzo+987,+San+Miguel+de+Tucum%C3%A1n&output=embed"
            loading="lazy"
            className="w-full h-64 md:h-80"
          />
        </div>
      </div>

      {/* bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 text-xs flex flex-col md:flex-row items-center justify-between gap-2 text-gray-400">
          <p>© {new Date().getFullYear()} QRTech — Todos los derechos reservados.</p>
          
        </div>
      </div>
    </footer>
  );
}
