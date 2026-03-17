import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurant } from "../../data/restaurant";
import { crearReserva, contarSlot } from "../../service/reservas";

function buildWhatsAppMessage(form, selectedItems, confirmacion = false) {
  const lines = [
    confirmacion
      ? `✅ *Reserva confirmada en ${restaurant.name}*`
      : `¡Hola! Quisiera reservar una mesa en *${restaurant.name}*`,
    ``,
    `📅 *Fecha:* ${form.fecha}`,
    `🕐 *Hora:* ${form.hora}`,
    `👥 *Personas:* ${form.personas}`,
    `👤 *Nombre:* ${form.nombre}`,
    `📞 *Teléfono:* ${form.telefono}`,
  ];
  if (form.notas) lines.push(`📝 *Notas:* ${form.notas}`);
  if (selectedItems?.length > 0) {
    lines.push(``);
    lines.push(`🧾 *Platos de interés:*`);
    selectedItems.forEach((item) => lines.push(`  • ${item}`));
  }
  if (!confirmacion) {
    lines.push(``);
    lines.push(`_Tu reserva está pendiente de confirmación. Te avisamos pronto!_ 🙌`);
  }
  return lines.join("\n");
}

const steps = ["Cuándo", "Quién", "Confirmar"];

export default function ReservationForm({ cart }) {
  const selectedItems = Object.entries(cart)
    .filter(([, v]) => v.qty > 0)
    .map(([name, { qty }]) => `${qty}x ${name}`);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ fecha: "", hora: "", personas: "2", nombre: "", telefono: "", notas: "" });
  const [slotsOcupados, setSlotsOcupados] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Verificar disponibilidad cuando cambia la fecha
  useEffect(() => {
    if (!form.fecha) return;
    setLoadingSlots(true);
    Promise.all(
      restaurant.timeSlots.map(async (slot) => {
        const count = await contarSlot(form.fecha, slot);
        return [slot, count >= restaurant.capacidadPorSlot];
      })
    ).then((results) => {
      setSlotsOcupados(Object.fromEntries(results));
      setLoadingSlots(false);
      // Si el slot elegido quedó ocupado, deseleccionar
      if (form.hora && results.find(([s, ocupado]) => s === form.hora && ocupado)) {
        update("hora", "");
      }
    });
  }, [form.fecha]);

  const isStep0Valid = form.fecha && form.hora && form.personas;
  const isStep1Valid = form.nombre && form.telefono;

  const handleSend = async () => {
    setEnviando(true);
    setError("");
    try {
      await crearReserva({ ...form, platosSeleccionados: selectedItems });
      const msg = buildWhatsAppMessage(form, selectedItems);
      const url = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
      setSent(true);
    } catch (e) {
      setError("Hubo un error al guardar la reserva. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="reserva" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-amber-500 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Hacé tu reserva</p>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
            Reservá tu mesa
          </h2>
          <p className="text-stone-500">Completá los datos y te confirmamos por WhatsApp.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">¡Solicitud enviada!</h3>
              <p className="text-stone-500 mb-2">Tu reserva está <span className="font-semibold text-amber-500">pendiente de confirmación</span>.</p>
              <p className="text-stone-400 text-sm mb-5">El restaurante te va a confirmar por WhatsApp en breve.</p>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-left max-w-sm mx-auto">
                <span className="text-2xl">🔔</span>
                <div>
                  <p className="text-amber-800 font-semibold text-sm">Recordatorio automático</p>
                  <p className="text-amber-600 text-xs">Te mandamos un WP 2hs antes de tu reserva para que no se te olvide.</p>
                </div>
              </div>
              <button
                onClick={() => { setSent(false); setStep(0); setForm({ fecha: "", hora: "", personas: "2", nombre: "", telefono: "", notas: "" }); }}
                className="text-amber-500 font-semibold hover:underline"
              >
                Hacer otra reserva
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Step indicators */}
              <div className="flex items-center justify-center gap-3 mb-10">
                {steps.map((label, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i < step ? "bg-amber-500 text-white" : i === step ? "bg-amber-500 text-white ring-4 ring-amber-100" : "bg-stone-100 text-stone-400"}`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      <span className={`text-xs font-medium ${i === step ? "text-amber-600" : "text-stone-400"}`}>{label}</span>
                    </div>
                    {i < steps.length - 1 && <div className={`w-12 h-0.5 mb-5 transition-all duration-500 ${i < step ? "bg-amber-400" : "bg-stone-200"}`} />}
                  </div>
                ))}
              </div>

              <div className="bg-stone-50 rounded-3xl p-8">
                <AnimatePresence mode="wait">
                  {/* Step 0 */}
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-6">
                      <h3 className="text-xl font-bold text-stone-800 mb-6">¿Cuándo querés venir?</h3>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Fecha</label>
                        <input
                          type="date"
                          min={today}
                          value={form.fecha}
                          onChange={(e) => update("fecha", e.target.value)}
                          className="w-full bg-white border-2 border-stone-200 focus:border-amber-400 rounded-xl px-4 py-3 text-stone-800 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Horario {loadingSlots && <span className="text-amber-400 font-normal">verificando disponibilidad...</span>}
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {restaurant.timeSlots.map((slot) => {
                            const ocupado = slotsOcupados[slot];
                            const seleccionado = form.hora === slot;
                            return (
                              <button
                                key={slot}
                                disabled={ocupado || loadingSlots}
                                onClick={() => update("hora", slot)}
                                className={`py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                                  ocupado
                                    ? "bg-stone-100 text-stone-300 cursor-not-allowed line-through"
                                    : seleccionado
                                    ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                                    : "bg-white border-2 border-stone-200 text-stone-600 hover:border-amber-300"
                                }`}
                              >
                                {slot}
                                {ocupado && <span className="block text-xs font-normal">Lleno</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Personas: <span className="text-amber-500 text-lg">{form.personas}</span>
                        </label>
                        <input type="range" min="1" max="12" value={form.personas} onChange={(e) => update("personas", e.target.value)} className="w-full accent-amber-500" />
                        <div className="flex justify-between text-xs text-stone-400 mt-1"><span>1</span><span>12</span></div>
                      </div>
                      <button onClick={() => setStep(1)} disabled={!isStep0Valid} className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-4 rounded-2xl transition-all duration-200">
                        Continuar →
                      </button>
                    </motion.div>
                  )}

                  {/* Step 1 */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-5">
                      <h3 className="text-xl font-bold text-stone-800 mb-6">Tus datos de contacto</h3>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Nombre completo</label>
                        <input type="text" placeholder="Tu nombre" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} className="w-full bg-white border-2 border-stone-200 focus:border-amber-400 rounded-xl px-4 py-3 text-stone-800 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">WhatsApp / Teléfono</label>
                        <input type="tel" placeholder="+54 9 11 1234-5678" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} className="w-full bg-white border-2 border-stone-200 focus:border-amber-400 rounded-xl px-4 py-3 text-stone-800 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Notas <span className="text-stone-400 font-normal">(opcional)</span></label>
                        <textarea placeholder="Alergias, celebraciones, preferencias..." value={form.notas} onChange={(e) => update("notas", e.target.value)} rows={3} className="w-full bg-white border-2 border-stone-200 focus:border-amber-400 rounded-xl px-4 py-3 text-stone-800 outline-none transition-colors resize-none" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setStep(0)} className="flex-1 border-2 border-stone-200 text-stone-600 font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-colors">← Volver</button>
                        <button onClick={() => setStep(2)} disabled={!isStep1Valid} className="flex-[2] bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-4 rounded-2xl transition-all duration-200">Continuar →</button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                      <h3 className="text-xl font-bold text-stone-800 mb-6">Confirmá tu reserva</h3>
                      <div className="space-y-3 mb-6">
                        {[
                          { icon: "📅", label: "Fecha", value: form.fecha },
                          { icon: "🕐", label: "Hora", value: form.hora },
                          { icon: "👥", label: "Personas", value: `${form.personas} persona${form.personas > 1 ? "s" : ""}` },
                          { icon: "👤", label: "Nombre", value: form.nombre },
                          { icon: "📞", label: "Teléfono", value: form.telefono },
                          ...(form.notas ? [{ icon: "📝", label: "Notas", value: form.notas }] : []),
                        ].map(({ icon, label, value }) => (
                          <div key={label} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3">
                            <span>{icon}</span>
                            <div>
                              <p className="text-xs text-stone-400 font-medium">{label}</p>
                              <p className="text-stone-800 font-semibold">{value}</p>
                            </div>
                          </div>
                        ))}
                        {selectedItems.length > 0 && (
                          <div className="bg-white rounded-xl px-4 py-3">
                            <p className="text-xs text-stone-400 font-medium mb-2">🧾 Platos de interés</p>
                            {selectedItems.map((item) => <p key={item} className="text-stone-700 text-sm">• {item}</p>)}
                          </div>
                        )}
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-700">
                        Tu reserva quedará <strong>pendiente</strong> hasta que el restaurante la confirme. Te avisamos por WhatsApp.
                      </div>

                      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                      <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="flex-1 border-2 border-stone-200 text-stone-600 font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-colors">← Volver</button>
                        <button
                          onClick={handleSend}
                          disabled={enviando}
                          className="flex-[2] bg-green-500 hover:bg-green-600 disabled:bg-stone-300 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          {enviando ? (
                            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              Enviar solicitud
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
