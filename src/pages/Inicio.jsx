// src/pages/Inicio.jsx
import React from 'react';
import Hero from '../components/Hero';
import FormasDePago from "../components/FormasDePago";
import TrustChips from '../components/TrustChips';
import MVSection from '../components/MVSection';
import Featured from '../components/Featured';
import Footer from "../components/Footer";

import '../styles/inicio.css';

export default function Inicio() {
  return (
    <>
      
      <Hero />

      <main className="alt-bg text-white">
        <TrustChips />
        <MVSection />
        <Featured />
        <FormasDePago />
        <Footer />
      </main>
    </>
  );
}
