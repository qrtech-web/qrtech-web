// src/hooks/useTipoCambio.js
import { useState, useEffect } from 'react';

export default function useTipoCambio() {
  const [usd, setUsd] = useState(null);      // valor en ARS
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      try {
        // Ejemplo gratis 🇦🇷 – dólar blue/banco: https://api.bluelytics.com.ar/v2/latest
        const res = await fetch('https://api.bluelytics.com.ar/v2/latest');
        const data = await res.json();
        setUsd(data.blue.value_avg);         // o data.oficial.value_avg
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  return { usd, loading };
}
