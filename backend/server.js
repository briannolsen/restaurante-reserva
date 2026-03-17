import "dotenv/config";
import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const app = express();
const PORT = 3001;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// POST /api/crear-preferencia
// Body: { items: [{name, price, qty}], reservaId, nombre, telefono }
app.post("/api/crear-preferencia", async (req, res) => {
  const { items, reservaId, nombre, telefono } = req.body;

  if (!items?.length || !reservaId) {
    return res.status(400).json({ error: "Faltan datos del pedido" });
  }

  try {
    const pref = await new Preference(client).create({
      body: {
        items: items.map((item) => ({
          title: item.name,
          unit_price: Number(item.price),
          quantity: Number(item.qty),
          currency_id: "ARS",
        })),
        payer: {
          name: nombre || "",
          phone: { number: String(telefono || "") },
        },
        back_urls: {
          success: `${FRONTEND_URL}/pago-exitoso`,
          failure: `${FRONTEND_URL}/pago-fallido`,
          pending: `${FRONTEND_URL}/pago-pendiente`,
        },
        // auto_return solo funciona con URLs públicas (no localhost)
        ...(FRONTEND_URL.startsWith("http://localhost") ? {} : { auto_return: "approved" }),
        external_reference: reservaId,
      },
    });

    res.json({
      init_point: pref.init_point,           // producción
      sandbox_init_point: pref.sandbox_init_point, // testing
    });
  } catch (e) {
    console.error("Error creando preferencia MP:", e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/mp-webhook  (Mercado Pago IPN)
app.post("/api/mp-webhook", async (req, res) => {
  const { type, data } = req.body;

  if (type === "payment" && data?.id) {
    try {
      const payment = await new Payment(client).get({ id: data.id });
      console.log(
        `Pago ${payment.id} | estado: ${payment.status} | ref: ${payment.external_reference}`
      );
      // Acá podrías actualizar Firebase directamente usando firebase-admin si querés doble confirmación
    } catch (e) {
      console.error("Error procesando webhook:", e);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
  if (!process.env.MP_ACCESS_TOKEN) {
    console.warn("⚠️  MP_ACCESS_TOKEN no configurado — copiá .env.example a .env");
  }
});
