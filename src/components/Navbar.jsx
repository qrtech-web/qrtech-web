// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavWhatsAppCTA from './NavWhatsAppCTA';


const links = ["Inicio", "Productos"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  /** cierra menú al navegar */
  const linkClass = ({ isActive }) =>
  (isActive
    ? "block w-full pb-1 text-gray-100 after:block after:w-full after:h-0.5 after:bg-gray-100"
    : "block w-full pb-1 text-gray-400 hover:text-gray-200") +
  " font-carter";

  return (
    <header className="sticky top-0 inset-x-0 z-50">
      {/* barra superior glass */}
      <nav className="h-16 backdrop-blur-md bg-gray-900/60 flex items-center px-6 lg:px-10">
        <NavLink
          to="/"
          className="font-carter text-2xl text-gray-100 hover:text-gray-300"
          onClick={() => setOpen(false)}
        >
          QRTech
        </NavLink>

        {/* desktop links */}
        <ul className="ml-auto hidden md:flex items-center gap-10">
          {links.map(label => (
            <li key={label}>
              <NavLink to={label === "Inicio" ? "/inicio" : `/${label.toLowerCase()}`} className={linkClass}>
                {label}
              </NavLink>
            </li>
          ))}
          <li><NavWhatsAppCTA /></li>

        </ul>

        {/* hamburger */}
        <button
          className="md:hidden ml-auto text-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <Bars3Icon className="w-7 h-7" />
          )}
        </button>
      </nav>

      {/* menú móvil deslizable */}
      <div
        className={`md:hidden bg-gray-900/90 backdrop-blur-md px-6 pt-4 pb-8 space-y-4
                    origin-top transition-transform ${
                      open ? "scale-y-100" : "scale-y-0"
                    }`}
        style={{ transformOrigin: "top" }}
      >
        {links.map(label => (
          <NavLink
            key={label}
            to={label === "/" ? "/inicio" : `/${label.toLowerCase()}`}
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
