// src/components/AdminModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function AdminModal({ producto, onSave, onClose }) {
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    precio: '',
    stock: '',
    descripcion: '',
    imagen: '',
    categoria: '',
    destacado: false,
  });

  /* ---------- carga inicial ---------- */
  useEffect(() => {
    if (producto) setForm(producto);
  }, [producto]);

  /* ---------- helpers ---------- */
  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submit = e => {
    e.preventDefault();
    // Si es alta, generamos un ID simple basado en el nombre
    const id = form.id || form.nombre.toLowerCase().replace(/\s+/g, '-');
    onSave({ ...form, id });
  };

  /* ---------- render ---------- */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl w-full max-w-lg space-y-4"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            {producto ? 'Editar' : 'Nuevo'} producto
          </h3>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* campos */}
        {[
          ['nombre', 'Nombre'],
          ['precio', 'Precio'],
          ['stock', 'Stock'],
          ['imagen', 'URL imagen'],
          ['categoria', 'Categoría'],
        ].map(([key, label]) => (
          <input
            key={key}
            name={key}
            placeholder={label}
            value={form[key]}
            onChange={handle}
            className="input mb-4"
            required
          />
        ))}

        <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handle}
            className="input mb-4 h-24 resize-none"
            required
          />

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="destacado"
            checked={form.destacado}
            onChange={handle}
          />
          Destacado
        </label>

        <button className="btn btn--primary flex items-center justify-center gap-1 w-full">
          <Save size={16} /> Guardar
        </button>
      </form>
    </div>
  );
}
