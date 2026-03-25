export const restaurant = {
  name: "Kansas",
  tagline: "Cocina de autor con sabor a hogar",
  description:
    "Un espacio íntimo donde cada plato cuenta una historia. Ingredientes frescos, recetas propias y una atmósfera que invita a quedarse.",
  whatsapp: "5491130466533",
  address: "Av. Corrientes 1234, CABA",
  hours: "Mar–Dom · 12:00 – 16:00 · 20:00 – 00:00",
  heroImage:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  ],
  menu: [
    {
      category: "Entradas",
      emoji: "🥗",
      items: [
        { name: "Burrata con tomates asados", price: 3200, description: "Burrata fresca, tomates cherry asados, albahaca y reducción de balsámico" },
        { name: "Croquetas de jamón ibérico", price: 2800, description: "Con alioli de limón y hierbas frescas" },
        { name: "Pulpo a la brasa", price: 4500, description: "Sobre puré de papas ahumado y pimentón de la Vera" },
      ],
    },
    {
      category: "Principales",
      emoji: "🍽️",
      items: [
        { name: "Bife de chorizo madurado", price: 7800, description: "400g, papas rústicas y chimichurri de la casa" },
        { name: "Pasta fresca al funghi", price: 5200, description: "Tagliatelle casero, mix de hongos, crema de parmesano y trufa" },
        { name: "Pollo de campo al horno", price: 5900, description: "Con vegetales de estación y jugo de cocción" },
        { name: "Risotto de mariscos", price: 6400, description: "Langostinos, calamares, mejillones y azafrán" },
      ],
    },
    {
      category: "Postres",
      emoji: "🍮",
      items: [
        { name: "Crème brûlée de vainilla", price: 2200, description: "Con frambuesas frescas y galleta sablée" },
        { name: "Volcán de chocolate", price: 2500, description: "Corazón fundido, helado de crema y caramelo salado" },
        { name: "Tabla de quesos", price: 3800, description: "Selección de quesos artesanales, frutos secos y mermelada casera" },
      ],
    },
    {
      category: "Bebidas",
      emoji: "🍷",
      items: [
        { name: "Vino de la casa (copa)", price: 1800, description: "Tinto, blanco o rosado — cosecha del chef" },
        { name: "Agua mineral", price: 800, description: "Con o sin gas" },
        { name: "Limonada de jengibre", price: 1400, description: "Fresca, artesanal, con menta" },
      ],
    },
  ],
  timeSlots: ["12:00", "12:30", "13:00", "13:30", "14:00", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"],
  capacidadPorSlot: 4, // máximo de reservas confirmadas por horario
};
