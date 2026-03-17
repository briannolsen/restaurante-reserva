import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurant } from "../../data/restaurant";
import { suscribirReservas, actualizarEstado } from "../../service/reservas";

function buildMsgConfirmacion(r) {
  return encodeURIComponent(
    `✅ *¡Tu reserva en ${restaurant.name} está confirmada!*\n\n📅 *Fecha:* ${r.fecha}\n🕐 *Hora:* ${r.hora}\n👥 *Personas:* ${r.personas}\n\n¡Te esperamos! 🍽️`
  );
}

function buildMsgRechazo(r) {
  return encodeURIComponent(
    `❌ *Reserva en ${restaurant.name}*\n\nHola ${r.nombre}, lamentablemente no tenemos disponibilidad para:\n📅 ${r.fecha} a las ${r.hora}\n\nPodés intentar con otro horario. ¡Disculpá los inconvenientes! 🙏`
  );
}

const ESTADO_STYLES = {
  pendiente: "bg-amber-100 text-amber-700 border-amber-200",
  confirmada: "bg-green-100 text-green-700 border-green-200",
  rechazada: "bg-red-100 text-red-700 border-red-200",
  pagado: "bg-blue-100 text-blue-700 border-blue-200",
  esperando_pago: "bg-stone-100 text-stone-500 border-stone-200",
};

const ESTADO_LABEL = {
  pendiente: "⏳ Pendiente",
  confirmada: "✅ Confirmada",
  rechazada: "❌ Rechazada",
  pagado: "💳 Pagado",
  esperando_pago: "🕐 Esperando pago",
};

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState("");
  const [errorAuth, setErrorAuth] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("pendiente");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!autenticado) return;
    const unsub = suscribirReservas((data) => {
      setReservas(data);
      setLoading(false);
    });
    return () => unsub();
  }, [autenticado]);

  const handleLogin = () => {
    if (password === restaurant.adminPassword) {
      setAutenticado(true);
    } else {
      setErrorAuth(true);
      setTimeout(() => setErrorAuth(false), 2000);
    }
  };

  const handleActualizar = async (id, estado) => {
    await actualizarEstado(id, estado);
  };

  const reservasFiltradas = reservas.filter((r) => {
    const matchEstado = filtro === "todas" || r.estado === filtro;
    const matchFecha = !fechaFiltro || r.fecha === fechaFiltro;
    return matchEstado && matchFecha;
  });

  const counts = {
    pendiente: reservas.filter((r) => r.estado === "pendiente").length,
    confirmada: reservas.filter((r) => r.estado === "confirmada").length,
    rechazada: reservas.filter((r) => r.estado === "rechazada").length,
  };

  // Login screen
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-10 w-full max-w-sm text-center"
        >
          <p className="text-4xl font-bold text-stone-900 mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}>
            {restaurant.name}
          </p>
          <p className="text-stone-400 text-sm mb-8">Panel de administración</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={`w-full border-2 rounded-xl px-4 py-3 outline-none text-center text-stone-800 mb-4 transition-colors ${
              errorAuth ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-amber-400"
            }`}
          />
          <AnimatePresence>
            {errorAuth && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mb-3">
                Contraseña incorrecta
              </motion.p>
            )}
          </AnimatePresence>
          <button
            onClick={handleLogin}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-2xl transition-colors"
          >
            Ingresar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {restaurant.name}
          </span>
          <span className="text-stone-400 text-sm ml-3">Admin</span>
        </div>
        <button onClick={() => setAutenticado(false)} className="text-stone-400 hover:text-white text-sm transition-colors">
          Salir
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pendientes", count: counts.pendiente, color: "amber" },
            { label: "Confirmadas", count: counts.confirmada, color: "green" },
            { label: "Rechazadas", count: counts.rechazada, color: "red" },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 text-center shadow-sm">
              <p className={`text-3xl font-bold text-${color}-500 mb-1`}>{count}</p>
              <p className="text-stone-500 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          {["pendiente", "confirmada", "rechazada", "todas"].map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                filtro === e ? "bg-stone-900 text-white" : "bg-white text-stone-600 hover:bg-stone-200"
              }`}
            >
              {e === "todas" ? "Todas" : ESTADO_LABEL[e]}
              {e !== "todas" && <span className="ml-1.5 text-xs opacity-70">({counts[e]})</span>}
            </button>
          ))}
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="ml-auto bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 outline-none focus:border-amber-400"
          />
          {fechaFiltro && (
            <button onClick={() => setFechaFiltro("")} className="text-stone-400 hover:text-stone-700 text-sm">✕ Limpiar</button>
          )}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center py-20 text-stone-400">Cargando reservas...</div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="text-center py-20 text-stone-400">No hay reservas para mostrar</div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {reservasFiltradas.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="bg-white rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-stone-900">{r.nombre}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ESTADO_STYLES[r.estado]}`}>
                          {ESTADO_LABEL[r.estado]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500">
                        <span>📅 {r.fecha}</span>
                        <span>🕐 {r.hora}</span>
                        <span>👥 {r.personas} personas</span>
                        <span>📞 {r.telefono}</span>
                      </div>
                      {r.notas && <p className="text-sm text-stone-400 mt-1.5 italic">"{r.notas}"</p>}
                      {r.platosSeleccionados?.length > 0 && (
                        <p className="text-xs text-stone-400 mt-1">
                          🧾 {r.platosSeleccionados.join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {r.estado === "pendiente" && (
                        <>
                          <a
                            href={`https://wa.me/${r.telefono.replace(/\D/g, "")}?text=${buildMsgConfirmacion(r)}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => handleActualizar(r.id, "confirmada")}
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors text-center"
                          >
                            ✅ Confirmar
                          </a>
                          <a
                            href={`https://wa.me/${r.telefono.replace(/\D/g, "")}?text=${buildMsgRechazo(r)}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => handleActualizar(r.id, "rechazada")}
                            className="bg-red-100 hover:bg-red-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl transition-colors text-center"
                          >
                            ❌ Rechazar
                          </a>
                        </>
                      )}
                      {r.estado === "confirmada" && (
                        <a
                          href={`https://wa.me/${r.telefono.replace(/\D/g, "")}?text=${buildMsgConfirmacion(r)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold px-4 py-2 rounded-xl transition-colors text-center"
                        >
                          💬 Re-enviar WP
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
