// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import Calculadora from './pages/Calculadora'


import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Página de inicio */}
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />

          {/* Catálogo y secciones */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/calculadora" element={<Calculadora /> } />
          
          
          
        </Routes>
        <Footer />
      </Layout>
    </BrowserRouter>
  );
}
