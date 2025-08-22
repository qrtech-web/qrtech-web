import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function Calculadora() {
  /* -------- datos desde ProductoCard -------- */
  const { state } = useLocation();
  const nombre    = state?.nombre  ?? "Producto";
  const imagen    = state?.imagen  ?? "";
  const precioUsd = state?.precio  ?? 0;
  const waBase    = state?.wa      ?? "https://wa.me/5493815677391";

  /* -------- cotización USD → ARS -------- */
  const [usdArs, setUsdArs] = useState(null);
  useEffect(() => {
    axios
      .get("https://api.exchangerate.host/latest?base=USD&symbols=ARS")
      .then(r => setUsdArs(r.data.rates.ARS))
      .catch(() => setUsdArs(1300));
  }, []);

  /* -------- coeficientes de cuotas -------- */
  const coef = { 1:1.10, 2:1.241, 3:1.2919, 6:1.4819, 9:1.7337, 12:1.9984 };

  /* -------- cuota seleccionada -------- */
  const [sel, setSel] = useState(null);
  const ars = usdArs ?? 0;
  const totalArs = (c, k) => precioUsd * k * ars;

  /* -------- link WhatsApp -------- */
  const waLink = () => {
    const txtCuota = sel
      ? ` con el Plan ${sel.cuotas} cuotas: $${sel.cuota.toLocaleString()} ARS c/u`
      : "";
    const txt =
      ` a *${precioUsd} USD*.` +
      txtCuota +
      ``;
    return `${waBase}${encodeURIComponent(txt)}`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#030712] text-white px-4">
      <motion.div
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.6 }}
        className="w-full max-w-6xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-8"
      >
        <div className="grid sm:grid-cols-[260px_1fr] gap-8">
          {/* IZQUIERDA: foto + datos */}
          <div className="flex flex-col items-center sm:items-start">
            {imagen && (
              <div className="w-52 overflow-hidden rounded-2xl shadow-lg mb-6">
                <LazyLoadImage
                  src={imagen}
                  alt={nombre}
                  effect="blur"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <h1 className="text-2xl font-carter text-center sm:text-left">
              {nombre}
            </h1>
            <p className="text-indigo-400 font-bold text-lg">
              {precioUsd} USD
            </p>
            {usdArs && (
              <p className="text-soft-text text-sm">
                ≈ ${ (precioUsd * ars).toLocaleString() } ARS
              </p>
            )}
            
          </div>
          

          {/* DERECHA: tabla de cuotas */}
          {usdArs ? (
            <div className="overflow-x-auto">
              <h1 className="font-carter text-center text-2xl p-2">
                ¡Selecciona la cantidad de cuotas que quieras!
              </h1>
              <table className="w-full text-lg text-center border-collapse">
                <thead>
                  <tr className="bg-white/10 text-soft-text">
                    <th className="py-3 font-medium">Cuotas</th>
                    <th className="py-3 font-medium">Total ARS</th>
                    <th className="py-3 font-medium">Cuota ARS</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(coef).map(([c, k]) => {
                    const total = totalArs(c, k);
                    const cuota = total / c;
                    const activa = sel?.cuotas === +c;
                    return (
                      <tr
                        key={c}
                        onClick={() => setSel({ cuotas:+c, cuota })}
                        className={`
                          cursor-pointer transition-colors duration-200
                          ${activa ? 'text-green-400 opacity-120': 'hover:opacity-70'}
                          odd: bg-slate-600 even:bg-blue-950
                        `}
                      >
                        <td className="py-2">{c}</td>
                        <td>${ total.toLocaleString() }</td>
                        <td>${ cuota.toLocaleString() }</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-soft-text">Obteniendo cotización…</p>
          )}
        </div>

        {/* BOTÓN WA */}
        <div className="text-center mt-10">
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition active:scale-95 shadow-lg"
          >
            {/* ícono WA */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M20.52 3.48C18.117.877 14.23 0 11.05 0 4.952 0-.237 5.189.004 11.289c.142 3.276 1.59 6.432 3.979 8.751L.75 24l3.989-1.046c2.962 1.586 6.278 1.546 8.956.748 6.155-1.485 10.658-6.485 10.658-12.702 0-3.291-1.285-6.381-3.833-8.523zM11.05 21.984c-2.686 0-5.277-.702-7.537-2.031l-.537-.322-2.502.657.668-2.45-.35-.57C1.795 14.36 1.15 12.348 1.15 10.272c0-4.985 4.185-9.17 9.9-9.17 2.64 0 5.117 1.026 6.975 2.885 1.857 1.859 2.885 4.4 2.885 7.04 0 5.715-4.183 9.9-9.9 9.9z"/>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.786-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.298.297-.497.1-.198.05-.372-.025-.521-.075-.149-.672-1.612-.921-2.207-.242-.579-.487-.5-.672-.51l-.574-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.273-.198-.57-.347z"/>
            </svg>
            Consultar por WhatsApp
          </a>
          <p className="text-sm text-soft-text mt-2">
            Selecciona una fila para incluir la cuota en el mensaje.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
