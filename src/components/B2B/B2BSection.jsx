import { motion } from "framer-motion";

const CHICHO_WA = "5491130466533";


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
    <section id="restaurantes" className="py-16 bg-stone-800">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header compacto */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-stone-700 text-stone-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            Para restaurantes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
            ¿Tenés un restaurante?
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto text-sm">
            Sumá tu restaurante a ChichoReserva — reservas online, pedidos anticipados y cero comisión.
          </p>
        </motion.div>

        {/* Beneficios en grid compacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
        >
          {beneficios.map((b) => (
            <motion.div key={b.titulo} variants={cardVariants} className="bg-stone-700/50 rounded-2xl p-5 hover:bg-stone-700 transition-colors">
              <span className="text-2xl mb-2 block">{b.icon}</span>
              <h4 className="font-bold text-white text-sm mb-1">{b.titulo}</h4>
              <p className="text-stone-400 text-xs leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href={`https://wa.me/${CHICHO_WA}?text=${msg}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Quiero sumarlo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
