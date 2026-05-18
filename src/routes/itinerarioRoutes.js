// =========================================================
// itinerarioRoutes.js — Rutas del itinerario de un viaje
//
// Define los endpoints para gestionar la agenda (itinerario)
// de un viaje: ver, agregar y eliminar eventos.
// Prefijo base: /api/itinerarios  (definido en index.js)
// =========================================================

import express from 'express'
import {
  agregarItinerario,
  obtenerItinerario,
  eliminarItinerario
} from '../controllers/itinerarioController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/itinerarios/viaje/:id
// Devuelve todos los eventos del itinerario de un viaje,
// ordenados por fecha y hora
router.get('/viaje/:id', verifySession, obtenerItinerario)

// POST /api/itinerarios/viaje/:id
// Agrega un nuevo evento al itinerario del viaje
// (nombre del lugar, dirección, fecha, hora)
router.post('/viaje/:id', verifySession, agregarItinerario)

// DELETE /api/itinerarios/:itemId
// Elimina un evento específico del itinerario por su id
router.delete('/:itemId', verifySession, eliminarItinerario)

export default router
