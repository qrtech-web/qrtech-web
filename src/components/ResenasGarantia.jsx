// src/components/ResenasGarantia.jsx
import { motion } from "framer-motion";
import { StarIcon, ShieldCheckIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.45 },
};

function Stars({ n = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: n }).map((_, i) => (
        <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
      ))}
    </div>
  );
}

export default function ResenasGarantia() {
  return (
    <section className="bg-gray-950 text-gray-100 py-16 lg:py-20">
      <motion.div {...fade} className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Opiniones reales y garantía QRTech
        </h2>
        <p className="mt-3 text-gray-300">
          Queremos que compres con confianza: mostramos reseñas y aclaramos cómo funciona nuestra garantía.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
        {/* Reseñas */}
        <motion.div {...fade} className="rounded-2xl border border-white/10 bg-gray-900/40 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Reseñas de clientes</h3>
            <Stars />
          </div>

          <ul className="mt-4 space-y-4 text-sm">
            <li className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Gonzalo R.</span>
                <Stars />
              </div>
              <p className="mt-1 text-gray-300">
                Excelente atención. Coordiné la compra por WhatsApp y retiré en oficina con garantía escrita.
              </p>
            </li>
            <li className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Belén A.</span>
                <Stars />
              </div>
              <p className="mt-1 text-gray-300">
                El equipo llegó impecable, tal como en el catálogo. Me ayudaron a calcular cuotas.
              </p>
            </li>
            <li className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Matías I.</span>
                <Stars />
              </div>
              <p className="mt-1 text-gray-300">
                Transparencia total. Revisión previa y todo por escrito. Recomendados.
              </p>
            </li>
          </ul>

          {/* Placeholder para embebido real de Google Reviews si querés más adelante */}
          <div className="mt-5 text-xs text-gray-400">
            Tip: si tenés tu ficha de Google Maps, luego podemos embeber el widget oficial acá.
          </div>
        </motion.div>

        {/* Garantía */}
        <motion.div {...fade} className="rounded-2xl border border-white/10 bg-gray-900/40 p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
            Garantía QRTech (resumen)
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
              Garantía escrita entregada en el momento de retiro.
            </li>
            <li className="flex items-start gap-3">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
              Revisión en oficina al retirar el equipo.
            </li>
            <li className="flex items-start gap-3">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
              Soporte por WhatsApp ante cualquier consulta post-venta.
            </li>
          </ul>

          <div className="mt-5 rounded-xl bg-white/5 border border-white/10 p-4 text-xs text-gray-400">
            *Podemos ajustar este texto según tus políticas internas (alcance, plazos y condiciones).
          </div>
        </motion.div>
      </div>
    </section>
  );
}
