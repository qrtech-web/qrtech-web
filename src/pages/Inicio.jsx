// src/pages/Inicio.jsx
import React from 'react';
import Hero from '../components/Hero';
import FormasDePago from "../components/FormasDePago";
import TrustChips from '../components/TrustChips';
import MVSection from '../components/MVSection';
import Featured from '../components/Featured';
import Footer from "../components/Footer";
import ComoComprar from '../components/ComoComprar';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ResenasGarantia from '../components/ResenasGarantia';
import SeoHead from '../components/SeoHead';
import Faq from '../components/Faq';




import '../styles/inicio.css';

<SeoHead
  title="QRTech — iPhones usados premium con garantía en Tucumán"
  description="Elegí tu iPhone, simulá cuotas y coordiná retiro con garantía escrita en San Lorenzo 987. Atención con cita y plan canje."
  url="https://qrtech.com.ar/inicio"
  schema={{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "QRTech",
    "url": "https://qrtech.com.ar",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "San Lorenzo 987",
      "addressLocality": "San Miguel de Tucumán",
      "addressRegion": "Tucumán",
      "addressCountry": "AR"
    },
    "areaServed": "San Miguel de Tucumán",
    "sameAs": []
  }}
/>


function ScrollToHashOnMount() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);

    // reintenta un par de veces por si aún no se montó la sección
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries < 10) {
        tries += 1;
        setTimeout(tick, 80);
      }
    };
    // primer intento
    setTimeout(tick, 0);
  }, [location.pathname, location.hash]);

  return null;
}


export default function Inicio() {
  return (
    <>
      
      <Hero />

      <main className="alt-bg text-white">
        <ScrollToHashOnMount />
        <TrustChips />
        
        <Featured />
        <ComoComprar />
        <ResenasGarantia />
        <MVSection />
        <Faq />
        <FormasDePago />
        <Footer />
      </main>
    </>
  );
}
