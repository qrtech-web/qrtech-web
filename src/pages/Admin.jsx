// src/pages/Admin.jsx
import React, { useState } from 'react';
import {
  PlusCircle,
  Trash2,
  Edit2,
  Download,
} from 'lucide-react';
import useProductosLocal from '../hooks/useDarkMode';
import AdminModal from '../components/AdminModal';

export default function Admin() {
  const {
    productos,
    loading,
    error,
    add,
    update,
    remove,
    exportJson,
  } = useProductosLocal();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);

  if (loading) return <p className="container">Cargando…</p>;
  if (error)   return <p className="container">Error: {error.message}</p>;

  /* ---------- handlers ---------- */
  const abrirNuevo = () => {
    setProductoEdit(null);
    setModalAbierto(true);
  };
  const abrirEditar = prod => {
    setProductoEdit(prod);
    setModalAbierto(true);
  };

  return (
    <section className="container">
      <h2 className="mb-4">Panel de administración</h2>

      {/* acciones */}
      <div className="flex gap-3 mb-6">
        <button className="btn btn--success" onClick={abrirNuevo}>
          <PlusCircle size={18} /> Nuevo producto
        </button>

        <a
          href={exportJson()}
          download="productos.json"
          className="btn btn--secondary"
        >
          <Download size={18} /> Exportar JSON
        </a>
      </div>

      {/* tabla */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="p-2">Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Cat.</th>
              <th>Dest.</th>
              <th className="w-28">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="text-sm odd:bg-slate-50 dark:odd:bg-slate-800/40">
                <td className="p-2">
                  <img src={p.imagen} alt="" className="h-12 w-12 object-cover rounded" />
                </td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>{p.categoria}</td>
                <td>{p.destacado ? '⭐' : ''}</td>
                <td className="flex gap-2 justify-center py-2">
                  <button onClick={() => abrirEditar(p)} title="Editar">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => remove(p.id)} title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {modalAbierto && (
        <AdminModal
          producto={productoEdit}
          onClose={() => setModalAbierto(false)}
          onSave={(prod) => {
            productoEdit ? update(productoEdit.id, prod) : add(prod);
            setModalAbierto(false);
          }}
        />
      )}
    </section>
  );
}
