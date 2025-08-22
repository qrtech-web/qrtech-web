// src/pages/Contacto.jsx
import { useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function Contacto() {
  /* ------------------ estado ------------------ */
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);

  /* ------------------ handlers ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Enviar a Firestore o EmailJS
    console.table(form);
    setSent(true);
    setForm({ nombre: "", email: "", mensaje: "" });
    setTimeout(() => setSent(false), 4000);
  };

  /* ------------------ UI ---------------------- */
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#030712] px-4 py-24">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-10">
        {/* heading */}
        <h1
          className="text-center font-carter text-3xl sm:text-4xl mb-10"
          data-aos="fade-down"
        >
          Ponte en contacto
        </h1>

        {/* grid 2 cols en md */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* datos / mapa / whatsapp */}
          <div className="space-y-6 text-soft-text">
            <p>
              ¿Tienes dudas sobre disponibilidad o financiación? Escríbenos y te
              respondemos en menos de&nbsp;24 h.
            </p>

            <div className="space-y-3 text-sm">
              <p>
                <b className="text-gray-100">Correo:</b>&nbsp;
                qrtechtucuman@qrtech.com.ar
              </p>
              <p>
                <b className="text-gray-100">WhatsApp:</b>&nbsp;+54 9 381 567 7391
              </p>
              <p>
                <b className="text-gray-100">Dirección:</b>&nbsp;San Miguel de
                Tucumán, AR
              </p>
            </div>

            
          </div>

          {/* formulario */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            data-aos="fade-left"
            noValidate
          >
            <FloatingInput
              Icon={UserIcon}
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <FloatingInput
              Icon={EnvelopeIcon}
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <FloatingTextarea
              Icon={ChatBubbleLeftIcon}
              label="Mensaje"
              name="mensaje"
              rows={4}
              value={form.mensaje}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn btn-primary w-full">
              <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
              Enviar mensaje
            </button>

            {sent && (
              <p className="text-green-400 text-center">
                ¡Mensaje enviado correctamente!
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- componentes auxiliares ---------- */
function FloatingInput({
  Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  ...rest
}) {
  return (
    <label className="relative block">
      <Icon className="w-5 h-5 text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="w-full pl-10 py-3 rounded-xl bg-white/10 border border-white/20
                   text-sm placeholder-transparent focus:outline-none focus:border-primary
                   focus:ring-1 focus:ring-primary transition"
        {...rest}
      />
      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-soft-text text-sm pointer-events-none transition-all
                      peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-3
                      peer-placeholder-shown:text-base">
        {label}
      </span>
    </label>
  );
}

function FloatingTextarea({ Icon, label, ...props }) {
  return (
    <label className="relative block">
      <Icon className="w-5 h-5 text-primary absolute left-3 top-3 pointer-events-none" />
      <textarea
        {...props}
        placeholder=" "
        className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/20
                   text-sm placeholder-transparent focus:outline-none focus:border-primary
                   focus:ring-1 focus:ring-primary transition resize-none"
      />
      <span className="absolute left-10 top-3 text-soft-text text-sm pointer-events-none transition-all
                      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base">
        {label}
      </span>
    </label>
  );
}
