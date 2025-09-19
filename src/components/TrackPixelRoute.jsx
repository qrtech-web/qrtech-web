// src/components/TrackPixelRoute.jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function TrackPixelRoute() {
  const { pathname, search } = useLocation();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Evita duplicar el PageView del snippet base en el primer render
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, search]);

  return null;
}
