// =========================================================
// viajesRoutes.js — Rutas de viajes
//
// Define los endpoints para crear, consultar y actualizar viajes.
// Prefijo base: /api/viajes  (definido en index.js)
// Todas las rutas están protegidas con verifySession.
// =========================================================

import express from 'express'
import { crearViaje, obtenerViajes, actualizarViaje, obtenerViaje } from '../controllers/viajesController.js'
import { verifySession } from '../middleware/authMiddleware.js'

// upload: middleware para recibir archivos (la imagen del viaje)
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// GET /api/viajes
// Devuelve todos los viajes del usuario autenticado
// (los que creó + los que pertenece como integrante)
router.get('/', verifySession, obtenerViajes)

// POST /api/viajes
// Crea un nuevo viaje. Primero verifica sesión, luego procesa
// una imagen opcional con multer (upload.single), y finalmente
// llama al controlador crearViaje
router.post('/', verifySession, upload.single('imagen'), crearViaje)

// PATCH /api/viajes/:id
// Actualiza parcialmente un viaje (ej: cambiar el estado).
// :id es el identificador del viaje en la URL
router.patch('/:id', verifySession, actualizarViaje)

// GET /api/viajes/:id
// Devuelve los datos de un viaje específico por su id
router.get('/:id', verifySession, obtenerViaje)

export default router
