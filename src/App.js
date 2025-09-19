// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Formulario from "./pages/Formulario";
import Calculadora from "./pages/Calculadora";

import WhatsAppFloat from './components/WhatsAppFloat';
import ScrollManager from './components/ScrollManager';


// (si no tenés ListaClientes, no la importes)

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Navbar />
      {/* PageView por cambio de ruta */}
      <TrackPixelRoute />
      <Routes>
        {/* 1) Redirigimos "/" hacia "/inicio" para que siempre haya contenido */}
        <Route path="/" element={<Navigate to="/inicio" replace />} />

        {/* 2) Ruta explícita para /inicio */}
        <Route path="/inicio" element={<Inicio />} />

        {/* 3) Catálogo (y alias por compatibilidad) */}
        <Route path="/productos" element={<Productos />} />
        <Route path="/products" element={<Productos />} />

        {/* 4) Otras páginas */}
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/calculadora" element={<Calculadora />} />


        {/* 5) 404 básico (opcional) */}
        <Route path="*" element={<div style={{padding:24}}>Página no encontrada</div>} />
      </Routes>
            {/* Botón flotante de WhatsApp en todas las páginas */}
      <WhatsAppFloat phone="5493815677391" />

    </BrowserRouter>
  );
}
