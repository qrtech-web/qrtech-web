// src/components/TrackPixelRoute.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TrackPixelRoute() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Dispara un PageView cada vez que cambia la URL interna
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, search]);

  return null;
}
