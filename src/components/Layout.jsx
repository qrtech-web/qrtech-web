// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {/* Compensa la altura del navbar */}
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}
