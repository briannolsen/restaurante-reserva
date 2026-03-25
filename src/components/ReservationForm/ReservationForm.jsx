import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurant } from "../../data/restaurant";
import { crearReserva, contarSlot, obtenerReservaPorCodigo, escucharReserva } from "../../service/reservas";
import { crearPreferenciaPago } from "../../service/pagos";

// ─── Helpers ────────────────────────────────────────────────────────────────

const WA_ICON = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

const TIPO_OPTIONS = [
  { id: "preorden", icon: "🪑", label: "Comer en el lugar", desc: "La comida lista al llegar" },
  { id: "takeaway", icon: "🥡", label: "Para llevar", desc: "Para retirar y llevar" },
];

const TODAY_STR = new Date().toISOString().split("T")[0];

function validarNombre(v) {
  if (!v) return "";
  if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(v)) return "Solo letras y espacios";
  if (v.trim().length < 2) return "Mínimo 2 caracteres";
  return "";
}

function validarTelefono(v) {
  if (!v) return "";
  if (!/^[0-9+\s\-()\\.]+$/.test(v)) return "Solo dígitos, +, guiones y paréntesis";
  const digits = v.replace(/\D/g, "");
  if (digits.length < 7) return "Teléfono muy corto";
  if (digits.length > 15) return "Teléfono muy largo";
  return "";
}

// ─── CalendarPicker ──────────────────────────────────────────────────────────

function CalendarPicker({ value, onChange, minStr }) {
  const minDate = new Date(minStr + "T00:00:00");
  const initial = value
    ? { y: +value.slice(0, 4), m: +value.slice(5, 7) - 1 }
    : { y: minDate.getFullYear(), m: minDate.getMonth() };
  const [vy, setVy] = useState(initial.y);
  const [vm, setVm] = useState(initial.m);

  const prevMonth = () => {
    if (vm === 0) { setVm(11); setVy((y) => y - 1); }
    else setVm((m) => m - 1);
  };
  const nextMonth = () => {
    if (vm === 11) { setVm(0); setVy((y) => y + 1); }
    else setVm((m) => m + 1);
  };

  const canGoPrev =
    vy > minDate.getFullYear() ||
    (vy === minDate.getFullYear() && vm > minDate.getMonth());

  const daysInMonth = new Date(vy, vm + 1, 0).getDate();
  const firstDay = new Date(vy, vm, 1).getDay();
  const startOffset = (firstDay + 6) % 7; // Monday=0

  return (
    <div className="bg-white border-2 border-stone-200 rounded-2xl p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-bold"
        >
          ‹
        </button>
        <span className="font-bold text-stone-800 text-sm">
          {MONTH_NAMES[vm]} {vy}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors text-lg font-bold"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs text-stone-400 font-semibold py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const ds = `${vy}-${String(vm + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const date = new Date(ds + "T00:00:00");
          const past = date < minDate;
          const selected = value === ds;
          const today = ds === TODAY_STR;

          return (
            <button
              key={day}
              type="button"
              disabled={past}
              onClick={() => onChange(ds)}
              className={`h-9 w-full rounded-xl text-sm font-medium transition-all
                ${past ? "text-stone-300 cursor-not-allowed" : ""}
                ${selected ? "bg-amber-500 text-white shadow-md shadow-amber-200" : ""}
                ${!past && !selected && today ? "ring-2 ring-amber-400 text-amber-600 font-bold" : ""}
                ${!past && !selected && !today ? "text-stone-700 hover:bg-amber-50 hover:text-amber-700" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── CartPreview ─────────────────────────────────────────────────────────────

function CartPreview({ items, total, onUpdateQty }) {
  if (items.length === 0) {
    return (
      <div className="bg-stone-100 rounded-xl p-4 text-center text-stone-500 text-sm">
        No seleccionaste platos aún.{" "}
        <a href="#menu" className="text-amber-500 font-semibold hover:underline">
          Ver menú →
        </a>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {items.map(([name, { qty, price }]) => (
        <div
          key={name}
          className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-stone-200"
        >
          <div>
            <p className="text-sm font-medium text-stone-800">{name}</p>
            <p className="text-xs text-amber-500">${(qty * price).toLocaleString("es-AR")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQty(name, price, -1)}
              className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-bold flex items-center justify-center transition-colors"
            >
              −
            </button>
            <span className="w-5 text-center text-sm font-bold text-stone-800">{qty}</span>
            <button
              onClick={() => onUpdateQty(name, price, 1)}
              className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-bold flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center px-1 pt-1 border-t border-stone-200">
        <span className="text-stone-500 text-sm">
          {items.reduce((s, [, v]) => s + v.qty, 0)} platos
        </span>
        <span className="font-bold text-stone-800">${total.toLocaleString("es-AR")}</span>
      </div>
    </div>
  );
}

// ─── ValidatedInput ──────────────────────────────────────────────────────────

function ValidatedInput({ label, type = "text", placeholder, value, onChange, validate, hint }) {
  const [touched, setTouched] = useState(false);
  const err = touched ? validate(value) : "";
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-stone-800 outline-none transition-colors
          ${err ? "border-red-400 focus:border-red-500" : "border-stone-200 focus:border-amber-400"}`}
      />
      {err ? (
        <p className="text-red-500 text-xs mt-1">{err}</p>
      ) : hint ? (
        <p className="text-stone-400 text-xs mt-1">{hint}</p>
      ) : null}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const steps = ["Cuándo", "Quién", "Confirmar"];

export default function ReservationForm({ cart, onUpdateQty }) {
  const [mode, setMode] = useState(null); // null | 'reservar' | 'ya-tengo'

  // --- Reservar mesa ---
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    personas: "2",
    nombre: "",
    telefono: "",
    notas: "",
  });
  const [tipoPedido, setTipoPedido] = useState(null);
  const [slotsOcupados, setSlotsOcupados] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [sent, setSent] = useState(false);         // solo reserva WA (sin pago)
  const [esperandoPago, setEsperandoPago] = useState(false); // abrió MP, esperando
  const [pagoConcretado, setPagoConcretado] = useState(false); // Firestore confirmó "pagado"
  const [codigoReserva, setCodigoReserva] = useState("");
  const [mpLink, setMpLink] = useState("");
  const [error, setError] = useState("");
  const unsubPagoRef = useRef(null);

  // --- Ya tengo reserva ---
  const [codigoInput, setCodigoInput] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [reservaEncontrada, setReservaEncontrada] = useState(null);
  const [tipoPedidoExistente, setTipoPedidoExistente] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [mpLinkExistente, setMpLinkExistente] = useState("");
  const [enviandoExistente, setEnviandoExistente] = useState(false);
  const [esperandoPagoExistente, setEsperandoPagoExistente] = useState(false);
  const [pagoConcretadoExistente, setPagoConcretadoExistente] = useState(false);
  const unsubPagoExistenteRef = useRef(null);

  const items = Object.entries(cart).filter(([, v]) => v.qty > 0);
  const total = items.reduce((s, [, v]) => s + v.qty * v.price, 0);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

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
      if (form.hora && results.find(([s, ocupado]) => s === form.hora && ocupado)) {
        update("hora", "");
      }
    });
  }, [form.fecha, form.hora]);

  const isStep0Valid =
    form.fecha && form.hora && form.personas && (!tipoPedido || items.length > 0);
  const isStep1Valid =
    form.nombre &&
    form.telefono &&
    !validarNombre(form.nombre) &&
    !validarTelefono(form.telefono);

  // Abre la ventana de MP ANTES del await (dentro del evento click) para evitar popup blocker
  const handleSend = async () => {
    setEnviando(true);
    setError("");
    setMpLink("");

    const withPayment = tipoPedido && items.length > 0;
    let mpWindow = null;
    if (withPayment) {
      mpWindow = window.open("about:blank", "_blank");
    }

    try {
      const selectedItems = items.map(([name, { qty }]) => `${qty}x ${name}`);

      if (withPayment) {
        const { id: reservaId, codigoReserva } = await crearReserva({
          ...form,
          tipo: tipoPedido,
          platosSeleccionados: selectedItems,
          total,
          estado: "esperando_pago",
        });
        const mpItems = items.map(([name, { qty, price }]) => ({ name, qty, price }));
        const { init_point } = await crearPreferenciaPago({
          items: mpItems,
          reservaId,
          nombre: form.nombre,
          telefono: form.telefono,
        });
        setMpLink(init_point);
        if (mpWindow) mpWindow.location.href = init_point;
        setEsperandoPago(true);
        // Escuchar Firestore hasta que el pago se confirme
        unsubPagoRef.current = escucharReserva(reservaId, (data) => {
          if (data.estado === "pagado") {
            setCodigoReserva(codigoReserva);
            setPagoConcretado(true);
            setEsperandoPago(false);
            if (unsubPagoRef.current) { unsubPagoRef.current(); unsubPagoRef.current = null; }
          }
        });
      } else {
        const { codigoReserva } = await crearReserva({
          ...form,
          tipo: "solo_mesa",
          platosSeleccionados: selectedItems,
        });
        setCodigoReserva(codigoReserva);
        const lines = [
          `¡Hola! Quisiera reservar una mesa en *${restaurant.name}*`,
          ``,
          `📅 *Fecha:* ${form.fecha}`,
          `🕐 *Hora:* ${form.hora}`,
          `👥 *Personas:* ${form.personas}`,
          `👤 *Nombre:* ${form.nombre}`,
          `📞 *Teléfono:* ${form.telefono}`,
          ...(form.notas ? [`📝 *Notas:* ${form.notas}`] : []),
          ...(selectedItems.length > 0
            ? [``, `🧾 *Platos de interés:*`, ...selectedItems.map((i) => `  • ${i}`)]
            : []),
          ``,
          `_Tu reserva está pendiente de confirmación. Te avisamos pronto!_ 🙌`,
        ];
        window.open(
          `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
          "_blank"
        );
        setSent(true);
      }
    } catch {
      if (mpWindow) mpWindow.close();
      setError("Hubo un error al procesar. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const handleBuscarReserva = async () => {
    if (!codigoInput.trim()) return;
    setBuscando(true);
    setErrorBusqueda("");
    setReservaEncontrada(null);
    setTipoPedidoExistente(null);
    setMpLinkExistente("");
    try {
      const data = await obtenerReservaPorCodigo(codigoInput.trim());
      if (!data) {
        setErrorBusqueda("No encontramos una reserva con ese código.");
      } else {
        setReservaEncontrada(data);
      }
    } catch {
      setErrorBusqueda("Error al buscar la reserva. Revisá el código.");
    } finally {
      setBuscando(false);
    }
  };

  const handlePagarExistente = async () => {
    const mpWindow = window.open("about:blank", "_blank");
    setEnviandoExistente(true);
    try {
      const mpItems = items.map(([name, { qty, price }]) => ({ name, qty, price }));
      const { init_point } = await crearPreferenciaPago({
        items: mpItems,
        reservaId: reservaEncontrada.id,
        nombre: reservaEncontrada.nombre,
        telefono: reservaEncontrada.telefono,
      });
      setMpLinkExistente(init_point);
      if (mpWindow) mpWindow.location.href = init_point;
      setEsperandoPagoExistente(true);
      unsubPagoExistenteRef.current = escucharReserva(reservaEncontrada.id, (data) => {
        if (data.estado === "pagado") {
          setPagoConcretadoExistente(true);
          setEsperandoPagoExistente(false);
          if (unsubPagoExistenteRef.current) { unsubPagoExistenteRef.current(); unsubPagoExistenteRef.current = null; }
        }
      });
    } catch {
      if (mpWindow) mpWindow.close();
      setErrorBusqueda("Error al generar el pago. Intentá de nuevo.");
    } finally {
      setEnviandoExistente(false);
    }
  };

  const resetReservar = () => {
    if (unsubPagoRef.current) { unsubPagoRef.current(); unsubPagoRef.current = null; }
    setStep(0);
    setForm({ fecha: "", hora: "", personas: "2", nombre: "", telefono: "", notas: "" });
    setTipoPedido(null);
    setSent(false);
    setEsperandoPago(false);
    setPagoConcretado(false);
    setMpLink("");
    setCodigoReserva("");
    setError("");
  };

  return (
    <section id="reserva" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-amber-500 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Reservas y pedidos
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-stone-900 mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            ¿Qué querés hacer?
          </h2>
        </motion.div>

        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { id: "reservar", icon: "📅", title: "Reservar mesa", sub: "Elegí fecha, hora y personas" },
            { id: "ya-tengo", icon: "🔑", title: "Ya tengo reserva", sub: "Ingresá tu código para pre-ordenar" },
          ].map(({ id, icon, title, sub }) => (
            <button
              key={id}
              onClick={() => { setMode(id); if (id === "reservar") resetReservar(); }}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                mode === id
                  ? "border-amber-500 bg-amber-50"
                  : "border-stone-200 hover:border-amber-300 bg-white"
              }`}
            >
              <span className="text-3xl mb-2 block">{icon}</span>
              <p className="font-bold text-stone-900 text-sm">{title}</p>
              <p className="text-stone-500 text-xs mt-0.5">{sub}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ RESERVAR MESA ═══ */}
          {mode === "reservar" && (
            <motion.div
              key="reservar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {/* PAGO CONFIRMADO */}
                {pagoConcretado ? (
                  <motion.div
                    key="pago-confirmado"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-stone-50 rounded-3xl p-8"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">¡Pago confirmado!</h3>
                    <p className="text-stone-500 mb-6">Tu pedido quedó registrado. El restaurante ya lo recibió.</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 max-w-sm mx-auto">
                      <p className="text-amber-700 text-xs font-semibold mb-1">Tu código de reserva</p>
                      <p className="font-mono text-amber-900 font-bold text-3xl tracking-widest">{codigoReserva}</p>
                      <p className="text-amber-600 text-xs mt-1">Anotalo — lo vas a necesitar si querés agregar otro pedido</p>
                    </div>
                    <button onClick={resetReservar} className="text-amber-500 font-semibold hover:underline text-sm">
                      Hacer otra reserva
                    </button>
                  </motion.div>

                ) : esperandoPago ? (
                  /* ESPERANDO PAGO */
                  <motion.div
                    key="esperando-pago"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-stone-50 rounded-3xl p-8"
                  >
                    <div className="flex items-center justify-center mb-6">
                      <span className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">Esperando confirmación</h3>
                    <p className="text-stone-500 mb-1">Completá el pago en la ventana de Mercado Pago.</p>
                    <p className="text-stone-400 text-sm mb-8">Esta pantalla se actualiza sola cuando el pago se confirme.</p>
                    <a
                      href={mpLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-semibold mb-6 transition-colors"
                    >
                      ¿No se abrió? Ir a Mercado Pago →
                    </a>
                    <div>
                      <button
                        onClick={resetReservar}
                        className="text-stone-400 hover:text-stone-600 text-xs transition-colors"
                      >
                        Cancelar y volver al formulario
                      </button>
                    </div>
                  </motion.div>

                ) : sent ? (
                  /* WA SUCCESS (solo mesa, sin pago) */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-stone-50 rounded-3xl p-8"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">¡Solicitud enviada!</h3>
                    <p className="text-stone-500 mb-2">
                      Tu reserva está <span className="font-semibold text-amber-500">pendiente de confirmación</span>.
                    </p>
                    <p className="text-stone-400 text-sm mb-6">El restaurante te va a confirmar por WhatsApp en breve.</p>
                    {codigoReserva && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 max-w-sm mx-auto">
                        <p className="text-amber-700 text-xs font-semibold mb-1">Tu código de reserva</p>
                        <p className="font-mono text-amber-900 font-bold text-3xl tracking-widest">{codigoReserva}</p>
                        <p className="text-amber-600 text-xs mt-1">Anotalo — lo vas a necesitar si querés agregar un pedido después</p>
                      </div>
                    )}
                    <button onClick={resetReservar} className="text-amber-500 font-semibold hover:underline text-sm">
                      Hacer otra reserva
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Steps indicator */}
                    <div className="flex items-center justify-center gap-3 mb-10">
                      {steps.map((label, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                i < step
                                  ? "bg-amber-500 text-white"
                                  : i === step
                                  ? "bg-amber-500 text-white ring-4 ring-amber-100"
                                  : "bg-stone-100 text-stone-400"
                              }`}
                            >
                              {i < step ? "✓" : i + 1}
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                i === step ? "text-amber-600" : "text-stone-400"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={`w-12 h-0.5 mb-5 transition-all duration-500 ${
                                i < step ? "bg-amber-400" : "bg-stone-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-stone-50 rounded-3xl p-8">
                      <AnimatePresence mode="wait">
                        {/* Step 0: Cuándo + tipo */}
                        {step === 0 && (
                          <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h3 className="text-xl font-bold text-stone-800">
                              ¿Cuándo querés venir?
                            </h3>

                            {/* Calendar */}
                            <div>
                              <label className="block text-sm font-semibold text-stone-700 mb-2">
                                Fecha
                              </label>
                              <CalendarPicker
                                value={form.fecha}
                                onChange={(ds) => update("fecha", ds)}
                                minStr={TODAY_STR}
                              />
                              {form.fecha && (
                                <p className="text-amber-600 text-xs font-semibold mt-2 text-center">
                                  Seleccionado: {new Date(form.fecha + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                                </p>
                              )}
                            </div>

                            {/* Horarios */}
                            <div>
                              <label className="block text-sm font-semibold text-stone-700 mb-2">
                                Horario{" "}
                                {loadingSlots && (
                                  <span className="text-amber-400 font-normal text-xs">
                                    verificando disponibilidad...
                                  </span>
                                )}
                              </label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {restaurant.timeSlots.map((slot) => {
                                  const ocupado = slotsOcupados[slot];
                                  const sel = form.hora === slot;
                                  return (
                                    <button
                                      key={slot}
                                      type="button"
                                      disabled={ocupado || loadingSlots || !form.fecha}
                                      onClick={() => update("hora", slot)}
                                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        ocupado
                                          ? "bg-stone-100 text-stone-300 cursor-not-allowed line-through"
                                          : !form.fecha
                                          ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                                          : sel
                                          ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                                          : "bg-white border-2 border-stone-200 text-stone-600 hover:border-amber-300"
                                      }`}
                                    >
                                      {slot}
                                      {ocupado && (
                                        <span className="block text-xs font-normal">Lleno</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                              {!form.fecha && (
                                <p className="text-stone-400 text-xs mt-2">
                                  Elegí una fecha primero
                                </p>
                              )}
                            </div>

                            {/* Personas */}
                            <div>
                              <label className="block text-sm font-semibold text-stone-700 mb-2">
                                Personas:{" "}
                                <span className="text-amber-500 text-lg">{form.personas}</span>
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="12"
                                value={form.personas}
                                onChange={(e) => update("personas", e.target.value)}
                                className="w-full accent-amber-500"
                              />
                              <div className="flex justify-between text-xs text-stone-400 mt-1">
                                <span>1</span>
                                <span>12</span>
                              </div>
                            </div>

                            {/* Tipo pedido */}
                            <div>
                              <label className="block text-sm font-semibold text-stone-700 mb-3">
                                ¿Querés agregar un pedido?{" "}
                                <span className="text-stone-400 font-normal">(opcional)</span>
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {TIPO_OPTIONS.map(({ id, icon, label, desc }) => (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() =>
                                      setTipoPedido((prev) => (prev === id ? null : id))
                                    }
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                      tipoPedido === id
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-stone-200 bg-white hover:border-amber-300"
                                    }`}
                                  >
                                    <span className="text-2xl mb-1 block">{icon}</span>
                                    <p className="font-bold text-stone-900 text-sm">{label}</p>
                                    <p className="text-stone-500 text-xs mt-0.5">{desc}</p>
                                  </button>
                                ))}
                              </div>
                              {tipoPedido && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-4 space-y-2"
                                >
                                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                                    Tu pedido
                                  </p>
                                  <CartPreview
                                    items={items}
                                    total={total}
                                    onUpdateQty={onUpdateQty}
                                  />
                                  {items.length === 0 && (
                                    <p className="text-amber-600 text-xs font-semibold text-center">
                                      ⚠️ Tenés que agregar platos del menú para continuar
                                    </p>
                                  )}
                                </motion.div>
                              )}
                            </div>

                            <button
                              onClick={() => setStep(1)}
                              disabled={!isStep0Valid}
                              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-4 rounded-2xl transition-all duration-200"
                            >
                              Continuar →
                            </button>
                          </motion.div>
                        )}

                        {/* Step 1: Datos */}
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5"
                          >
                            <h3 className="text-xl font-bold text-stone-800">
                              Tus datos de contacto
                            </h3>
                            <ValidatedInput
                              label="Nombre completo"
                              placeholder="Tu nombre"
                              value={form.nombre}
                              onChange={(v) => update("nombre", v)}
                              validate={validarNombre}
                            />
                            <ValidatedInput
                              label="WhatsApp / Teléfono"
                              type="tel"
                              placeholder="+54 9 11 1234-5678"
                              value={form.telefono}
                              onChange={(v) => update("telefono", v)}
                              validate={validarTelefono}
                              hint="Ej: +54 9 11 1234-5678"
                            />
                            <div>
                              <label className="block text-sm font-semibold text-stone-700 mb-2">
                                Notas{" "}
                                <span className="text-stone-400 font-normal">(opcional)</span>
                              </label>
                              <textarea
                                placeholder="Alergias, celebraciones, preferencias..."
                                value={form.notas}
                                onChange={(e) => update("notas", e.target.value)}
                                rows={3}
                                className="w-full bg-white border-2 border-stone-200 focus:border-amber-400 rounded-xl px-4 py-3 text-stone-800 outline-none transition-colors resize-none"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => setStep(0)}
                                className="flex-1 border-2 border-stone-200 text-stone-600 font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-colors"
                              >
                                ← Volver
                              </button>
                              <button
                                onClick={() => setStep(2)}
                                disabled={!isStep1Valid}
                                className="flex-[2] bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-4 rounded-2xl transition-all duration-200"
                              >
                                Continuar →
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 2: Confirmar */}
                        {step === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="text-xl font-bold text-stone-800 mb-6">
                              Confirmá tu reserva
                            </h3>
                            <div className="space-y-2 mb-5">
                              {[
                                { icon: "📅", label: "Fecha", value: form.fecha },
                                { icon: "🕐", label: "Hora", value: form.hora },
                                {
                                  icon: "👥",
                                  label: "Personas",
                                  value: `${form.personas} persona${form.personas > 1 ? "s" : ""}`,
                                },
                                { icon: "👤", label: "Nombre", value: form.nombre },
                                { icon: "📞", label: "Teléfono", value: form.telefono },
                                ...(form.notas ? [{ icon: "📝", label: "Notas", value: form.notas }] : []),
                                ...(tipoPedido
                                  ? [{ icon: tipoPedido === "preorden" ? "🪑" : "🥡", label: "Tipo pedido", value: tipoPedido === "preorden" ? "Comer en el lugar" : "Para llevar" }]
                                  : []),
                              ].map(({ icon, label, value }) => (
                                <div key={label} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3">
                                  <span>{icon}</span>
                                  <div>
                                    <p className="text-xs text-stone-400 font-medium">{label}</p>
                                    <p className="text-stone-800 font-semibold">{value}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {tipoPedido && items.length > 0 && (
                              <div className="mb-5">
                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                                  Tu pedido
                                </p>
                                <CartPreview items={items} total={total} onUpdateQty={onUpdateQty} />
                              </div>
                            )}

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-700">
                              {tipoPedido && items.length > 0
                                ? "Al completar el pago, tu reserva y pedido quedan confirmados."
                                : "Tu reserva quedará pendiente hasta que el restaurante la confirme. Te avisamos por WhatsApp."}
                            </div>

                            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                            <div className="flex gap-3">
                              <button
                                onClick={() => setStep(1)}
                                className="flex-1 border-2 border-stone-200 text-stone-600 font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-colors"
                              >
                                ← Volver
                              </button>
                              <button
                                onClick={handleSend}
                                disabled={enviando}
                                className={`flex-[2] ${
                                  tipoPedido && items.length > 0
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-green-500 hover:bg-green-600"
                                } disabled:bg-stone-300 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2`}
                              >
                                {enviando ? (
                                  <>
                                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                    <span className="text-sm">
                                      {tipoPedido && items.length > 0 ? "Preparando el pago..." : "Enviando reserva..."}
                                    </span>
                                  </>
                                ) : tipoPedido && items.length > 0 ? (
                                  <>Pagar con Mercado Pago · ${total.toLocaleString("es-AR")}</>
                                ) : (
                                  <>{WA_ICON} Enviar solicitud</>
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
            </motion.div>
          )}

          {/* ═══ YA TENGO RESERVA ═══ */}
          {mode === "ya-tengo" && (
            <motion.div
              key="ya-tengo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-stone-50 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-stone-800 mb-6">Ingresá tu código</h3>

              {/* Buscador */}
              {!reservaEncontrada && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Código de reserva
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: K7P2AB"
                      value={codigoInput}
                      onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleBuscarReserva()}
                      maxLength={6}
                      className="w-full bg-white border-2 border-stone-200 focus:border-amber-400 rounded-xl px-4 py-3 text-stone-800 outline-none transition-colors font-mono text-xl tracking-widest text-center"
                    />
                    <p className="text-stone-400 text-xs mt-1 text-center">6 caracteres · te lo mostramos al reservar</p>
                  </div>
                  {errorBusqueda && <p className="text-red-500 text-sm">{errorBusqueda}</p>}
                  <button
                    onClick={handleBuscarReserva}
                    disabled={buscando || !codigoInput.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {buscando ? (
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      "Buscar reserva →"
                    )}
                  </button>
                </div>
              )}

              {/* Pago confirmado - ya tengo reserva */}
              {pagoConcretadoExistente && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">¡Pago confirmado!</h3>
                  <p className="text-stone-500 text-sm mb-6">Tu pedido quedó registrado. El restaurante ya lo recibió.</p>
                  <button
                    onClick={() => {
                      if (unsubPagoExistenteRef.current) { unsubPagoExistenteRef.current(); unsubPagoExistenteRef.current = null; }
                      setReservaEncontrada(null); setCodigoInput(""); setTipoPedidoExistente(null);
                      setMpLinkExistente(""); setErrorBusqueda(""); setEsperandoPagoExistente(false); setPagoConcretadoExistente(false);
                    }}
                    className="text-amber-500 font-semibold hover:underline text-sm"
                  >
                    Volver
                  </button>
                </motion.div>
              )}

              {/* Esperando pago - ya tengo reserva */}
              {esperandoPagoExistente && !pagoConcretadoExistente && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="flex items-center justify-center mb-6">
                    <span className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Esperando confirmación</h3>
                  <p className="text-stone-500 text-sm mb-6">Completá el pago en la ventana de Mercado Pago. Esta pantalla se actualiza sola.</p>
                  <a href={mpLinkExistente} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-semibold mb-6 block transition-colors">
                    ¿No se abrió? Ir a Mercado Pago →
                  </a>
                  <button
                    onClick={() => {
                      if (unsubPagoExistenteRef.current) { unsubPagoExistenteRef.current(); unsubPagoExistenteRef.current = null; }
                      setEsperandoPagoExistente(false); setMpLinkExistente("");
                    }}
                    className="text-stone-400 hover:text-stone-600 text-xs transition-colors block mx-auto"
                  >
                    Cancelar y volver
                  </button>
                </motion.div>
              )}

              {/* Reserva encontrada */}
              {reservaEncontrada && !esperandoPagoExistente && !pagoConcretadoExistente && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div className="bg-white rounded-2xl p-4 border border-stone-200">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                      Tu reserva
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        { icon: "👤", value: reservaEncontrada.nombre },
                        { icon: "📅", value: reservaEncontrada.fecha },
                        { icon: "🕐", value: reservaEncontrada.hora },
                        { icon: "👥", value: `${reservaEncontrada.personas} personas` },
                      ].map(({ icon, value }) => (
                        <div key={value} className="flex items-center gap-2 text-stone-700">
                          <span>{icon}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">
                      ¿Qué querés hacer?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {TIPO_OPTIONS.map(({ id, icon, label, desc }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            setTipoPedidoExistente((prev) => (prev === id ? null : id))
                          }
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            tipoPedidoExistente === id
                              ? "border-amber-500 bg-amber-50"
                              : "border-stone-200 bg-white hover:border-amber-300"
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{icon}</span>
                          <p className="font-bold text-stone-900 text-sm">{label}</p>
                          <p className="text-stone-500 text-xs mt-0.5">{desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {tipoPedidoExistente && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3"
                    >
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Tu pedido
                      </p>
                      <CartPreview items={items} total={total} onUpdateQty={onUpdateQty} />

                      {errorBusqueda && (
                        <p className="text-red-500 text-sm">{errorBusqueda}</p>
                      )}

                      {mpLinkExistente ? (
                        <a
                          href={mpLinkExistente}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                          ✅ Ir a pagar · ${total.toLocaleString("es-AR")} →
                        </a>
                      ) : (
                        <button
                          onClick={handlePagarExistente}
                          disabled={enviandoExistente || items.length === 0}
                          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          {enviandoExistente ? (
                            <>
                              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                              <span className="text-sm">Preparando el pago...</span>
                            </>
                          ) : (
                            <>Pagar con Mercado Pago · ${total.toLocaleString("es-AR")}</>
                          )}
                        </button>
                      )}
                      <p className="text-center text-xs text-stone-500">
                        Pago seguro procesado por Mercado Pago 🔒
                      </p>
                    </motion.div>
                  )}

                  <button
                    onClick={() => {
                      setReservaEncontrada(null);
                      setCodigoInput("");
                      setTipoPedidoExistente(null);
                      setMpLinkExistente("");
                      setErrorBusqueda("");
                    }}
                    className="text-stone-400 hover:text-stone-600 text-sm transition-colors"
                  >
                    ← Buscar otro código
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
