import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Menu from "./components/Menu/Menu";
import Gallery from "./components/Gallery/Gallery";
import PreOrder from "./components/PickupOrder/PreOrder";
import ReservationForm from "./components/ReservationForm/ReservationForm";
import B2BSection from "./components/B2B/B2BSection";
import AdminPanel from "./components/Admin/AdminPanel";
import PagoExitoso from "./components/PagoResultado/PagoExitoso";
import PagoFallido from "./components/PagoResultado/PagoFallido";
import { restaurant } from "./data/restaurant";

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
      <Gallery />
      <PreOrder cart={cart} onUpdateQty={updateQty} />
      <ReservationForm cart={cart} />
      <B2BSection />
      <Footer />
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
