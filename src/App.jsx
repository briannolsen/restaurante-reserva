import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Menu from "./components/Menu/Menu";
import Gallery from "./components/Gallery/Gallery";
import ReservationForm from "./components/ReservationForm/ReservationForm";
import B2BSection from "./components/B2B/B2BSection";
import AdminPanel from "./components/Admin/AdminPanel";
import PagoExitoso from "./components/PagoResultado/PagoExitoso";
import PagoFallido from "./components/PagoResultado/PagoFallido";
import { restaurant } from "./data/restaurant";

function FloatingCart({ cart }) {
  const totalItems = Object.values(cart).reduce((sum, { qty }) => sum + qty, 0);
  const totalPrice = Object.values(cart).reduce((sum, { qty, price }) => sum + qty * price, 0);
  if (totalItems === 0) return null;
  return (
    <button
      onClick={() => document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3.5 rounded-2xl shadow-xl shadow-amber-200/60 transition-all duration-300 group"
    >
      <span className="text-xl">🛒</span>
      <div className="text-left">
        <p className="text-xs opacity-80 leading-none mb-0.5">
          {totalItems} {totalItems === 1 ? "plato" : "platos"}
        </p>
        <p className="font-bold leading-none">${totalPrice.toLocaleString("es-AR")}</p>
      </div>
      <span className="ml-1 text-amber-100 group-hover:translate-x-1 transition-transform">→</span>
    </button>
  );
}

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-10 text-center">
      <p className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
        {restaurant.name}
      </p>
      <p className="text-sm mb-1">{restaurant.address}</p>
      <p className="text-sm mb-4">{restaurant.hours}</p>
      <a href="#restaurantes" className="text-amber-400 hover:underline text-xs">¿Tenés un restaurante? Sumalo →</a>
      <p className="text-xs text-stone-600 mt-4">© {new Date().getFullYear()} {restaurant.name} · Powered by ChichoReserva</p>
    </footer>
  );
}

// cart: { [itemName]: { qty, price } }
function ClienteSite() {
  const [cart, setCart] = useState({});

  const updateQty = (name, price, delta) => {
    setCart((prev) => {
      const current = prev[name]?.qty || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: { qty: next, price } };
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Menu cart={cart} onUpdateQty={updateQty} />
      <ReservationForm cart={cart} onUpdateQty={updateQty} />
      <Gallery />
      <Footer />
      <B2BSection />
      <FloatingCart cart={cart} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClienteSite />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/pago-fallido" element={<PagoFallido />} />
        <Route path="/pago-pendiente" element={<PagoFallido />} />
      </Routes>
    </BrowserRouter>
  );
}
