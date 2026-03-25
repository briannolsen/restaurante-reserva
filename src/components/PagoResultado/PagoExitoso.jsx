import { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { actualizarEstado } from "../../service/reservas";
import { restaurant } from "../../data/restaurant";

export default function PagoExitoso() {
  const [params] = useSearchParams();
  const reservaId = params.get("external_reference");
  const actualizado = useRef(false);

  useEffect(() => {
    if (reservaId && !actualizado.current) {
      actualizado.current = true;
      actualizarEstado(reservaId, "pagado").catch(console.error);
    }
  }, [reservaId]);

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-10 max-w-sm w-full text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h1
          className="text-3xl font-bold text-stone-900 mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ¡Pago exitoso!
        </h1>
        <p className="text-stone-500 text-sm mb-6">
          Tu pedido está confirmado. El restaurante ya lo recibió.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left space-y-2">
          <p className="text-amber-800 font-semibold text-sm">👨‍🍳 Pre-pedido</p>
          <p className="text-amber-700 text-xs">Llegá a la hora que indicaste — tus platos van a estar en preparación.</p>
          <p className="text-amber-800 font-semibold text-sm mt-2">🥡 Take away</p>
          <p className="text-amber-700 text-xs">Te avisamos por WhatsApp cuando esté listo para retirar.</p>
        </div>

        <Link
          to="/"
          className="block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-2xl transition-colors mb-3"
        >
          Volver a {restaurant.name}
        </Link>
      </motion.div>
    </div>
  );
}
