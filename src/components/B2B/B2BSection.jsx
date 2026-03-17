import { motion } from "framer-motion";

const CHICHO_WA = "5491130466533";

const problemas = [
  { icon: "❌", text: "Sin sistema de reservas online" },
  { icon: "❌", text: "Pedidos caóticos por WhatsApp" },
  { icon: "❌", text: "Apps de delivery con 20–35% de comisión" },
  { icon: "❌", text: "Mesas vacías por no-shows" },
  { icon: "❌", text: "Personal sobrecargado con llamados" },
];

const beneficios = [
  { icon: "📅", titulo: "Reservas online 24/7", desc: "Tus clientes reservan solos, sin que nadie atienda el teléfono." },
  { icon: "🥡", titulo: "Pedidos para retirar", desc: "Canal propio de pedidos. Cero comisión a apps de delivery." },
  { icon: "🔔", titulo: "Recordatorios automáticos", desc: "WhatsApp automático 2hs antes. Menos no-shows, más rotación." },
  { icon: "📊", titulo: "Panel de gestión", desc: "Confirmá reservas y pedidos desde el celular en un click." },
  { icon: "💬", titulo: "Menú digital incluido", desc: "Tu carta siempre actualizada, sin imprimir nada." },
  { icon: "⚡", titulo: "Listo en 24hs", desc: "Tu restaurante online en menos de un día. Sin complicaciones técnicas." },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function B2BSection() {
  const msg = encodeURIComponent(
    `Hola! Me interesa sumar mi restaurante a ChichoReserva. ¿Me podés contar más?`
  );

  return (
    <section id="restaurantes" className="py-24 bg-amber-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Para restaurantes
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-stone-900 mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
            ¿Tenés un restaurante?
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">
            Sumá tu restaurante a ChichoReserva y dejá de perder reservas, tiempo y plata.
          </p>
        </motion.div>

        {/* Problemas vs Solución */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Problemas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-stone-200"
          >
            <h3 className="font-bold text-stone-800 text-lg mb-5">El problema de hoy</h3>
            <div className="space-y-3">
              {problemas.map((p) => (
                <div key={p.text} className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <p className="text-stone-600">{p.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comisiones */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-stone-900 rounded-3xl p-8 text-white"
          >
            <h3 className="font-bold text-lg mb-5">Comparativa de comisiones</h3>
            <div className="space-y-4">
              {[
                { label: "PedidosYa / Rappi", pct: "30%", color: "bg-red-500", w: "w-[90%]" },
                { label: "Uber Eats", pct: "25%", color: "bg-orange-500", w: "w-[75%]" },
                { label: "ChichoReserva", pct: "0%*", color: "bg-amber-500", w: "w-[5%]" },
              ].map(({ label, pct, color, w }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-300">{label}</span>
                    <span className="font-bold text-white">{pct}</span>
                  </div>
                  <div className="bg-stone-700 rounded-full h-2.5">
                    <div className={`${color} ${w} h-2.5 rounded-full transition-all`} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-stone-500 text-xs mt-4">* Costo fijo mensual por la plataforma, sin comisión por pedido.</p>
          </motion.div>
        </div>

        {/* Beneficios */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14"
        >
          {beneficios.map((b) => (
            <motion.div key={b.titulo} variants={cardVariants} className="bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-lg transition-shadow">
              <span className="text-3xl mb-3 block">{b.icon}</span>
              <h4 className="font-bold text-stone-900 mb-1">{b.titulo}</h4>
              <p className="text-stone-500 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-stone-900 rounded-3xl p-10 text-white"
        >
          <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
            ¿Listo para empezar?
          </h3>
          <p className="text-stone-400 mb-8">Tu restaurante online en menos de 24 horas.</p>
          <a
            href={`https://wa.me/${CHICHO_WA}?text=${msg}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Quiero sumarlo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
