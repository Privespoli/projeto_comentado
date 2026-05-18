// =========================================================
// integrantesRoutes.js — Rutas de integrantes de un viaje
//
// Define los endpoints para gestionar los miembros de un viaje.
// Prefijo base: /api/viajes/:viajeId/integrantes  (en index.js)
//
// mergeParams: true → permite acceder al parámetro :viajeId
// que viene del router padre (index.js), ya que este router
// está anidado dentro de /api/viajes/:viajeId/
// =========================================================

import express from 'express'
import { obtenerIntegrantes, agregarIntegrante, eliminarIntegrante } from '../controllers/integrantesController.js'
import { verifySession } from '../middleware/authMiddleware.js'

// mergeParams: true es necesario para que este router pueda leer
// el :viajeId definido en el router padre (index.js)
const router = express.Router({ mergeParams: true })

// GET /api/viajes/:viajeId/integrantes
// Lista todos los integrantes (con email y nombre) del viaje
router.get('/', verifySession, obtenerIntegrantes)

// POST /api/viajes/:viajeId/integrantes
// Agrega un nuevo integrante al viaje buscándolo por email
// Solo el titular del viaje puede hacerlo
router.post('/', verifySession, agregarIntegrante)

// DELETE /api/viajes/:viajeId/integrantes/:integranteId
// Elimina a un integrante del viaje por su id
// Solo el titular del viaje puede hacerlo
router.delete('/:integranteId', verifySession, eliminarIntegrante)

export default router
