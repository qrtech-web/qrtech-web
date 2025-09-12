// src/components/ScrollManager.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sube al tope en cada cambio de ruta (sin romper anchors tipo #plan-canje).
 */
export default function ScrollManager() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Si hay hash (#id), dejamos que lo maneje la página (por ejemplo Inicio.jsx)
    if (hash) return;
    // Caso general: nueva ruta → arriba del todo
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, search, hash]);

  return null;
}
