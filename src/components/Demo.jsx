import useTipoCambio from "../hooks/useTipoCambio";
import React, { useState } from 'react';

export default function DemoTipoCambio() {
  const { usd, loading } = useTipoCambio();

  if (loading) return <p>Cargando cotización…</p>;
  if (!usd)     return <p>Error al obtener cotización.</p>;

  return <p>1 USD ≈ {usd.toLocaleString()} ARS</p>;
}


