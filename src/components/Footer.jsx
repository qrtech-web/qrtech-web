// src/components/Footer.jsx
import React, { useState } from 'react';
import { Facebook, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // aquí podrías llamar a tu API de newsletter...
    alert('¡Gracias por suscribirte!');
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12">
      {/* Contenedor principal */}
      <div className="container mx-auto px-2 grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* 1. Sobre nosotros */}
        <div>
          <h4 className="text-white text-xl font-semibold mb-4">Sobre QRTech</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            3 amigos que decidieron vender el mejor producto al mejor precio.
          </p>
        </div>

        {/* 2. Enlaces rápidos */}
        <div>
          <h4 className="text-white text-xl font-semibold mb-4">Enlaces</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-primary transition-colors">
                Inicio
              </a>
            </li>
            <li>
              <a href="/productos" className="hover:text-primary transition-colors">
                Productos
              </a>
            </li>
            
            
          </ul>
        </div>

        {/* 3. Newsletter */}
        <div>
          <h4 className="text-white text-xl font-semibold mb-4">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">
            Recibe ofertas exclusivas y novedades directo en tu correo.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary text-gray-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Suscribirse
            </button>
          </form>
        </div>

        {/* 4. Contacto & Redes */}
        <div>
          <h4 className="text-white text-xl font-semibold mb-4">Contacto</h4>
          <a href=""><p className="text-gray-400 text-sm mb-2 hover:text-primary transition-colors">qrtechtucuman@gmail.com</p></a>
          <a href =""><p className="text-gray-400 text-sm mb-4 hover:text-primary transition-colors">+54 381 5 677-391</p></a>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com/qrtech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://instagram.com/qrtech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="mailto:info@qrtech.com.ar"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        <div className='flex w-20 h-20 justify-center items-center' >
          <a href="" className='text-center w-100% text-3xl font-carter hover:text-neutral-500 active:text-slate-800'>Volver</a>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} QRTech. Todos los derechos reservados.
      </div>
    </footer>
);
}
