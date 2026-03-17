import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { restaurant } from "../../data/restaurant";

export default function PagoFallido() {
  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-10 max-w-sm w-full text-center"
      >
        <div className="text-6xl mb-4">😕</div>
        <h1
          className="text-3xl font-bold text-stone-900 mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          Pago no completado
        </h1>
        <p className="text-stone-500 text-sm mb-6">
          No se procesó el pago. Podés intentarlo de nuevo o contactarnos directamente.
        </p>

        <Link
          to="/#pedido"
          className="block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-2xl transition-colors mb-3"
        >
          Intentar de nuevo
        </Link>
        <a
          href={`https://wa.me/${restaurant.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="block text-stone-500 hover:text-stone-700 text-sm transition-colors"
        >
          Contactar por WhatsApp →
        </a>
      </motion.div>
    </div>
  );
}
