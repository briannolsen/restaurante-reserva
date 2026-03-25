import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurant } from "../../data/restaurant";

function buildPreOrderMsg(form, cart) {
  const items = Object.entries(cart).filter(([, v]) => v.qty > 0);
  const total = items.reduce((s, [, v]) => s + v.qty * v.price, 0);

  const lines = [
    `🍽️ *Pre-pedido en ${restaurant.name}*`,
    ``,
    `👤 *Nombre:* ${form.nombre}`,
    `📞 *Teléfono:* ${form.telefono}`,
    `📅 *Fecha de llegada:* ${form.fecha}`,
    `🕐 *Hora estimada:* ${form.hora}`,
    ``,
    `🧾 *Platos a preparar:*`,
    ...items.map(([name, { qty, price }]) => `  • ${qty}x ${name} — $${(qty * price).toLocaleString("es-AR")}`),
    ``,
    `💰 *Total estimado: $${total.toLocaleString("es-AR")}*`,
    ``,
    `_Por favor tener los platos listos o en preparación al momento de mi llegada. ¡Gracias!_ 🙌`,
  ];
  return lines.join("\n");
}

export default function PreOrder({ cart, onUpdateQty }) {
  const [form, setForm] = useState({ nombre: "", telefono: "", fecha: "", hora: "" });
  const [sent, setSent] = useState(false);
  const [proximamente, setProximamente] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const items = Object.entries(cart).filter(([, v]) => v.qty > 0);
  const total = items.reduce((s, [, v]) => s + v.qty * v.price, 0);
  const totalQty = items.reduce((s, [, v]) => s + v.qty, 0);
  const isFormValid = form.nombre && form.telefono && form.fecha && form.hora;
  const today = new Date().toISOString().split("T")[0];

  const handlePagar = () => {
    setProximamente(true);
  };

  return (
    <section id="pedido" className="py-24 bg-stone-900 text-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Sin esperas</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
            Pedí antes de llegar
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto text-lg">
            Elegí tus platos ahora. Cuando llegues al restaurante, la cocina ya los tiene en camino.
          </p>

          {/* Pasos visuales */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            {[
              { icon: "📱", label: "Elegís los platos" },
              { icon: "👨‍🍳", label: "La cocina los prepara" },
              { icon: "🪑", label: "Llegás y comés" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-stone-800 flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <p className="text-stone-400 text-sm">{step.label}</p>
                </div>
                {i < 2 && <span className="text-stone-600 text-2xl hidden sm:block">→</span>}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Selección de platos */}
          <div>
            <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-4">Tu pedido anticipado</h3>
            {items.length === 0 ? (
              <div className="bg-stone-800 rounded-2xl p-8 text-center">
                <p className="text-4xl mb-3">🍴</p>
                <p className="text-stone-400 mb-1">No seleccionaste platos aún</p>
                <p className="text-stone-500 text-sm mb-4">Elegí desde el menú de arriba y volvé acá</p>
                <a href="#menu" className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                  Ver menú →
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {items.map(([name, { qty, price }]) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="bg-stone-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{name}</p>
                        <p className="text-amber-400 text-xs">${(qty * price).toLocaleString("es-AR")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onUpdateQty(name, price, -1)} className="w-7 h-7 rounded-full bg-stone-700 hover:bg-stone-600 text-white font-bold flex items-center justify-center transition-colors">−</button>
                        <span className="w-5 text-center font-bold text-white">{qty}</span>
                        <button onClick={() => onUpdateQty(name, price, 1)} className="w-7 h-7 rounded-full bg-stone-700 hover:bg-stone-600 text-white font-bold flex items-center justify-center transition-colors">+</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex justify-between items-center">
                  <span className="text-stone-300 text-sm">{totalQty} plato{totalQty > 1 ? "s" : ""}</span>
                  <span className="text-amber-400 font-bold text-lg">${total.toLocaleString("es-AR")}</span>
                </div>

                <a href="#menu" className="block text-center text-stone-500 hover:text-stone-300 text-sm transition-colors">
                  + Agregar más platos
                </a>
              </div>
            )}
          </div>

          {/* Formulario */}
          <AnimatePresence mode="wait">
            {proximamente ? (
              <motion.div
                key="proximamente"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-stone-800 rounded-3xl p-8 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mb-5">
                  🚀
                </div>
                <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Muy pronto</p>
                <h3 className="text-xl font-bold mb-3">El pago online ya está en camino</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 max-w-xs">
                  Estamos integrando Mercado Pago para que puedas reservar y pagar desde acá.
                  Por ahora, contactanos por WhatsApp y te confirmamos el pedido al instante.
                </p>
                <a
                  href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(buildPreOrderMsg(form, cart))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.997l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.656-.502-5.184-1.379l-.371-.22-3.844 1.008 1.026-3.748-.242-.386A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Confirmar por WhatsApp
                </a>
                <button
                  onClick={() => setProximamente(false)}
                  className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
                >
                  ← Volver al pedido
                </button>
              </motion.div>
            ) : sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-stone-800 rounded-3xl p-8 text-center"
              >
                <div className="text-5xl mb-4">👨‍🍳</div>
                <h3 className="text-xl font-bold mb-2">¡Pre-pedido enviado!</h3>
                <p className="text-stone-400 text-sm mb-2">La cocina va a estar lista para cuando llegues.</p>
                <p className="text-amber-400 text-sm font-semibold mb-6">¡A comer sin esperas!</p>
                <button
                  onClick={() => { setSent(false); setForm({ nombre: "", telefono: "", fecha: "", hora: "" }); }}
                  className="text-amber-400 font-semibold hover:underline text-sm"
                >
                  Hacer otro pre-pedido
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-stone-800 rounded-3xl p-6 space-y-5">
                <h3 className="font-bold text-lg">¿Cuándo llegás?</h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Nombre</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={(e) => update("nombre", e.target.value)}
                    className="w-full bg-stone-700 border-2 border-stone-600 focus:border-amber-400 rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+54 9 11 ..."
                    value={form.telefono}
                    onChange={(e) => update("telefono", e.target.value)}
                    className="w-full bg-stone-700 border-2 border-stone-600 focus:border-amber-400 rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder-stone-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Fecha</label>
                    <input
                      type="date"
                      min={today}
                      value={form.fecha}
                      onChange={(e) => update("fecha", e.target.value)}
                      className="w-full bg-stone-700 border-2 border-stone-600 focus:border-amber-400 rounded-xl px-3 py-3 text-white outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Hora estimada</label>
                    <select
                      value={form.hora}
                      onChange={(e) => update("hora", e.target.value)}
                      className="w-full bg-stone-700 border-2 border-stone-600 focus:border-amber-400 rounded-xl px-3 py-3 text-white outline-none transition-colors"
                    >
                      <option value="">Elegir</option>
                      {restaurant.timeSlots.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handlePagar}
                  disabled={items.length === 0 || !isFormValid}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-stone-600 disabled:text-stone-400 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Pagar con Mercado Pago · ${total.toLocaleString("es-AR")}
                </button>

                <p className="text-center text-xs text-stone-500">
                  Pago seguro procesado por Mercado Pago 🔒
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
