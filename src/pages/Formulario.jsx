// src/pages/Formulario.jsx
import { useState } from "react"
import { Mail, Phone, User2, MessageSquare } from "lucide-react"
import "../styles/styles.css"

export default function Formulario () {
  const [ok, setOk] = useState(false)
  const [f,setF]=useState({nombre:"",email:"",tel:"",msj:""})

  const handle = e => setF({ ...f, [e.target.name]:e.target.value })

  const send = e => { e.preventDefault(); /* aquí tu lógica Firestore */ setOk(true); }

  return (
    <section className="min-h-screen pt-24 pb-16 bg-bg-main text-text">
      <div className="container mx-auto max-w-lg px-4">
        <h2 className="text-center text-3xl font-bold mb-8">Hablemos</h2>

        {ok && <p className="mb-4 text-green-400">✅ Mensaje enviado, te responderemos pronto.</p>}

        <form onSubmit={send} className="space-y-4 glass p-8 rounded-xl">
          <Label icon={<User2/>} text="Nombre completo">
            <input required name="nombre" value={f.nombre} onChange={handle}/>
          </Label>
          <Label icon={<Mail/>} text="Email">
            <input required type="email" name="email" value={f.email} onChange={handle}/>
          </Label>
          <Label icon={<Phone/>} text="Teléfono">
            <input required name="tel" value={f.tel} onChange={handle}/>
          </Label>
          <Label icon={<MessageSquare/>} text="Mensaje">
            <textarea required name="msj" rows="4" value={f.msj} onChange={handle}/>
          </Label>
          <button className="btn btn--primary w-full">Enviar</button>
        </form>
      </div>
    </section>
  )
}

/* Componente auxiliar para icono + label */
function Label ({icon, text, children}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm mb-1">{icon}{text}</span>
      {children}
    </label>
  )
}
