import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurant } from "../../data/restaurant";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Menú", href: "#menu" },
    { label: "Reservas & Pedidos", href: "#reserva" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#hero"
          className={`text-3xl tracking-widest transition-colors`}
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: scrolled ? "#1c1917" : "#ffffff" }}
        >
          {restaurant.name}
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex gap-10 items-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:opacity-70 ${
                scrolled ? "text-stone-700" : "text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#reserva"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          >
            Reservar mesa
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden flex flex-col gap-1.5 p-2 ${scrolled ? "text-stone-900" : "text-white"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-4 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="px-6 py-4">
              <a
                href="#reserva"
                onClick={() => setMenuOpen(false)}
                className="block text-center bg-amber-500 text-white font-semibold py-3 rounded-full"
              >
                Reservar mesa
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
