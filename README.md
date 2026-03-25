# ChichoReserva

Plataforma SaaS para reservas de mesas en restaurantes, con pre-pedidos y cobro integrado a traves de Mercado Pago.

## Stack tecnologico

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express
- **Base de datos:** Firebase Firestore
- **Pagos:** Mercado Pago (Checkout Pro)
- **Notificaciones:** WhatsApp (mensajes automaticos)

## Funcionalidades

- Reservas online con seleccion de fecha, hora y cantidad de comensales
- Menu digital con pre-pedido antes de llegar al restaurante
- Cobro anticipado mediante Mercado Pago
- Panel de administracion para gestionar reservas y pedidos
- Notificaciones por WhatsApp (confirmacion, rechazo, recordatorios)
- Actualizaciones en tiempo real via Firestore

## Arquitectura

El proyecto se compone de dos partes:

- **Frontend (React + Vite):** aplicacion SPA que consume Firebase Firestore directamente para lectura y escritura de reservas. Se encuentra en la raiz del repositorio.
- **Backend (Node.js + Express):** servidor que gestiona la integracion con Mercado Pago (creacion de preferencias de pago y webhooks). Se encuentra en la carpeta `backend/`.

## Ejecucion local

### Frontend

```bash
npm install
npm run dev
```

El servidor de desarrollo se inicia en `http://localhost:5173`.

### Backend

```bash
cd backend
npm install
node server.js
```

## Variables de entorno

Copiar los archivos de ejemplo y completar con las credenciales correspondientes:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### Frontend (.env)

| Variable | Descripcion |
|---|---|
| `VITE_FIREBASE_API_KEY` | API key de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticacion de Firebase |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto en Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de almacenamiento de Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID de Firebase Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | App ID de Firebase |

### Backend (backend/.env)

| Variable | Descripcion |
|---|---|
| `MP_ACCESS_TOKEN` | Access token de Mercado Pago |
| `FRONTEND_URL` | URL del frontend (por defecto `http://localhost:5173`) |

## Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de produccion |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Previsualiza el build de produccion |
