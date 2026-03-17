import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurant } from "../../data/restaurant";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function QtyButton({ onClick, children, disabled }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      disabled={disabled}
      className="w-7 h-7 rounded-full bg-stone-100 hover:bg-amber-100 disabled:opacity-30 flex items-center justify-center text-stone-700 font-bold text-sm transition-colors"
    >
      {children}
    </button>
  );
}

export default function Menu({ cart, onUpdateQty }) {
  const [activeCategory, setActiveCategory] = useState(restaurant.menu[0].category);
  const currentCategory = restaurant.menu.find((c) => c.category === activeCategory);

  const totalItems = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = Object.values(cart).reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <section id="menu" className="py-24 bg-stone-50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-amber-500 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Lo que cocinamos</p>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
            Nuestro Menú
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto">
            Elegí tus platos con anticipación y cuando llegues la cocina ya los tiene en camino.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {restaurant.menu.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.category
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {cat.emoji} {cat.category}
            </button>
          ))}
        </div>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid md:grid-cols-2 gap-4"
          >
            {currentCategory.items.map((item) => {
              const inCart = cart[item.name];
              const qty = inCart?.qty || 0;

              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className={`rounded-2xl p-5 border-2 transition-all duration-200 ${
                    qty > 0
                      ? "border-amber-400 bg-amber-50 shadow-lg shadow-amber-100"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-900 mb-1">{item.name}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
                      <p className="font-bold text-stone-800 mt-2">${item.price.toLocaleString("es-AR")}</p>
                    </div>
                    {/* Qty control */}
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                      {qty === 0 ? (
                        <button
                          onClick={() => onUpdateQty(item.name, item.price, 1)}
                          className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg flex items-center justify-center transition-colors shadow-md shadow-amber-200"
                        >
                          +
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <QtyButton onClick={() => onUpdateQty(item.name, item.price, -1)}>−</QtyButton>
                          <motion.span
                            key={qty}
                            initial={{ scale: 1.4 }}
                            animate={{ scale: 1 }}
                            className="w-6 text-center font-bold text-amber-600"
                          >
                            {qty}
                          </motion.span>
                          <QtyButton onClick={() => onUpdateQty(item.name, item.price, 1)}>+</QtyButton>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Cart summary */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 bg-stone-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold">{totalItems} plato{totalItems > 1 ? "s" : ""} seleccionado{totalItems > 1 ? "s" : ""}</p>
                <p className="text-stone-400 text-sm">Total estimado: <span className="text-amber-400 font-bold">${totalPrice.toLocaleString("es-AR")}</span></p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <a href="#pedido" className="flex-1 sm:flex-none text-center bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors whitespace-nowrap">
                  Pre-pedido →
                </a>
                <a href="#reserva" className="flex-1 sm:flex-none text-center border border-white/30 hover:bg-white/10 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors whitespace-nowrap">
                  Reservar mesa →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
