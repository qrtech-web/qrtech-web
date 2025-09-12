// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {/* Compensación exacta del header: 56px (h-14) en mobile, 64px (h-16) en desktop */}
      <main className="pt-14 md:pt-16">
        {children}
      </main>
    </>
  );
}
