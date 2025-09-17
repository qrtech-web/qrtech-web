// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ArrowPathRoundedSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const links = ["Inicio", "Productos", "Calculadora"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    (isActive
      ? "block w-full pb-1 text-gray-100 after:block after:w-full after:h-0.5 after:bg-gray-100"
      : "block w-full pb-1 text-gray-400 hover:text-gray-200") + " font-carter";

  return (
    <header className="sticky top-0 inset-x-0 z-50">
      {/* TOP-BAR: solo desktop */}
      <div className="bg-gray-950/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="hidden md:flex items-center justify-center gap-8 py-1 text-xs text-gray-300">
            <span className="inline-flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-gray-200" />
              Garantía escrita
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-200" />
              Retiro en San Lorenzo 987
            </span>
            <a href="/inicio#plan-canje" className="inline-flex items-center gap-2 hover:text-gray-100">
              <ArrowPathRoundedSquareIcon className="w-4 h-4 text-gray-200" />
              Plan canje
            </a>
            <span className="inline-flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4 text-gray-200" />
              Atención con cita
            </span>
          </div>
        </div>
      </div>

      {/* NAV principal */}
      <nav className="h-14 md:h-16 backdrop-blur-md bg-gray-900/60 flex items-center px-6 lg:px-10">
        <NavLink
          to="/"
          className="font-carter text-2xl text-gray-100 hover:text-gray-300"
          onClick={() => setOpen(false)}
        >
          QRTech
        </NavLink>

        {/* links desktop */}
        <ul className="ml-auto hidden md:flex items-center gap-8">
          {links.map((label) => (
            <li key={label}>
              <NavLink
                to={label === "Inicio" ? "/inicio" : `/${label.toLowerCase()}`}
                className={linkClass}
              >
                {label}
              </NavLink>
            </li>
          ))}

          {/* anchors del Home */}
          <li>
            <a href="/inicio#como-comprar" className="block w-full pb-1 text-gray-400 hover:text-gray-200 font-carter">
              Cómo comprar
            </a>
          </li>
          <li>
            <a href="/inicio#plan-canje" className="block w-full pb-1 text-gray-400 hover:text-gray-200 font-carter">
              Plan canje
            </a>
          </li>

        {/* CTA */}
          <li>
            <a
              href="/productos"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-gray-100 transition"
            >
              Ver catálogo
            </a>
          </li>
        </ul>

        {/* botón hamburguesa */}
        <button
          className="md:hidden ml-auto text-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
      </nav>

      {/* MENÚ MÓVIL: se MONTA solo cuando está abierto (no tapa nada cuando está cerrado) */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]" aria-modal="true" role="dialog">
          {/* backdrop clickeable para cerrar */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          {/* panel */}
          <div
            className="absolute inset-x-0 top-[56px] bg-gray-900/95 backdrop-blur-md border-b border-white/10 shadow-lg
                       max-h-[calc(100vh-56px)] overflow-auto animate-[fadeIn_0.15s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-4 pb-8 space-y-2">
              {links.map((label) => (
                <NavLink
                  key={label}
                  to={label === "Inicio" ? "/inicio" : `/${label.toLowerCase()}`}
                  className={({ isActive }) =>
                    (isActive ? "text-gray-100" : "text-gray-300 hover:text-gray-100") + " block py-2 font-carter"
                  }
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}

              <a
                href="/inicio#como-comprar"
                className="block py-2 text-gray-300 hover:text-gray-100 font-carter"
                onClick={() => setOpen(false)}
              >
                Cómo comprar
              </a>
              <a
                href="/inicio#plan-canje"
                className="block py-2 text-gray-300 hover:text-gray-100 font-carter"
                onClick={() => setOpen(false)}
              >
                Plan canje
              </a>

              <a
                href="/productos"
                className="block mt-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-gray-100"
                onClick={() => setOpen(false)}
              >
                Ver catálogo
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
