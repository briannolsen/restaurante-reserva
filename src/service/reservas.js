import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { restaurant } from "../data/restaurant";

const COL = "reservas";

// Crear nueva reserva (estado: pendiente)
export async function crearReserva(data) {
  const docRef = await addDoc(collection(db, COL), {
    ...data,
    estado: "pendiente",
    restaurante: restaurant.name,
    creadoEn: serverTimestamp(),
  });
  return docRef.id;
}

// Actualizar estado: "confirmada" | "rechazada"
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

// Escuchar reservas en tiempo real (para el admin)
export function suscribirReservas(callback) {
  const q = query(collection(db, COL), orderBy("creadoEn", "desc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}
