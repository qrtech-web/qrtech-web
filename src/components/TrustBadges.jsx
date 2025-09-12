// src/components/TrustBadges.jsx
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  MapPinIcon,
  ArrowPathRoundedSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const item = {
  initial: { opacity: 0, y: 6 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  whileHover: { y: -2 },
  transition: { duration: 0.35 },
};

export default function TrustBadges({ compact = false }) {
  return (
    <div className={`${compact ? "" : "max-w-5xl mx-auto"} mt-6 px-4`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.div {...item} className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <ShieldCheckIcon className="w-5 h-5 text-emerald-300" />
          <span className="text-sm text-gray-200">Garantía escrita</span>
        </motion.div>

        <motion.div {...item} className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <MapPinIcon className="w-5 h-5 text-sky-300" />
          <span className="text-sm text-gray-200">Retiro en oficina</span>
        </motion.div>

        <motion.div {...item} className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <ArrowPathRoundedSquareIcon className="w-5 h-5 text-indigo-300" />
          <span className="text-sm text-gray-200">Plan canje</span>
        </motion.div>

        <motion.div {...item} className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <CalendarDaysIcon className="w-5 h-5 text-amber-300" />
          <span className="text-sm text-gray-200">Atención con cita</span>
        </motion.div>
      </div>
    </div>
  );
}
