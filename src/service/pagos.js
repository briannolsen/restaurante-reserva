// Llama al backend para crear una preferencia de pago de MP
// items: [{ name, price, qty }]
export async function crearPreferenciaPago({ items, reservaId, nombre, telefono }) {
  const res = await fetch("/api/crear-preferencia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, reservaId, nombre, telefono }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al crear preferencia de pago");
  }

  return res.json(); // { init_point, sandbox_init_point }
}
