// =========================================================
// poiRoutes.js — Rutas de Puntos de Interés (POI)
//
// POI (Point of Interest): lugares que los integrantes del
// viaje pueden proponer y votar para decidir si incluirlos.
// Prefijo base: /api/poi  (definido en index.js)
//
// router.use(verifySession) aplica la autenticación a TODAS
// las rutas de este router de una sola vez.
// =========================================================

import express from 'express'
import { crearLugarPOI, votarPOI, listarPOIsPorViaje, eliminarPOI } from '../controllers/poiController.js'
import { verifySession } from '../middleware/authMiddleware.js'

const router = express.Router()

// Protege todas las rutas de este router con verifySession.
// Es equivalente a poner verifySession en cada router.get/post/delete.
router.use(verifySession)

// GET /api/poi/viaje/:viajeId
// Lista todos los POIs de un viaje, con su puntuación de votos
router.get('/viaje/:viajeId', listarPOIsPorViaje)

// POST /api/poi/nuevo
// Crea un nuevo lugar de interés propuesto por un integrante
router.post('/nuevo', crearLugarPOI)

// POST /api/poi/votar
// Registra el voto de un usuario sobre un POI (positivo o negativo)
router.post('/votar', votarPOI)

// DELETE /api/poi/:poiId
// Elimina un POI por su id
router.delete('/:poiId', eliminarPOI)

export default router
