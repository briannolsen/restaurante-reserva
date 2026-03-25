import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { restaurant } from "../data/restaurant";

const COL = "reservas";

// Genera un código corto legible de 6 caracteres (sin I, O, 0, 1 para evitar confusión)
function generarCodigo() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Crear nueva reserva → devuelve { id, codigoReserva }
export async function crearReserva(data) {
  const codigoReserva = generarCodigo();
  const docRef = await addDoc(collection(db, COL), {
    ...data,
    codigoReserva,
    estado: data.estado || "pendiente",
    restaurante: restaurant.name,
    creadoEn: serverTimestamp(),
  });
  return { id: docRef.id, codigoReserva };
}

// Actualizar estado: "confirmada" | "rechazada" | "pagado"
export async function actualizarEstado(id, estado) {
  await updateDoc(doc(db, COL, id), { estado, actualizadoEn: serverTimestamp() });
}

// Contar reservas confirmadas para un slot (fecha + hora)
export async function contarSlot(fecha, hora) {
  const q = query(
    collection(db, COL),
    where("fecha", "==", fecha),
    where("hora", "==", hora),
    where("estado", "==", "confirmada")
  );
  const snap = await getDocs(q);
  return snap.size;
}

// Buscar reserva por código corto (para "ya tengo reserva")
export async function obtenerReservaPorCodigo(codigo) {
  const q = query(
    collection(db, COL),
    where("codigoReserva", "==", codigo.toUpperCase()),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

// Escuchar una reserva específica (para esperar confirmación de pago)
export function escucharReserva(id, callback) {
  return onSnapshot(doc(db, COL, id), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

// Escuchar reservas en tiempo real (para el admin)
export function suscribirReservas(callback) {
  const q = query(collection(db, COL), orderBy("creadoEn", "desc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}
