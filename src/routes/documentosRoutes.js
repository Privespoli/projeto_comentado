// =========================================================
// documentosRoutes.js — Rutas de documentos de un viaje
//
// Define los endpoints para subir, listar y eliminar
// documentos (PDFs, imágenes) asociados a un viaje.
// Prefijo base: /api/viajes/:viajeId/documentos  (en index.js)
//
// mergeParams: true → permite leer el :viajeId del router padre
// =========================================================

import express from 'express'
import { subirDocumento, obtenerDocumentos, eliminarDocumento } from '../controllers/documentosController.js'
import { verifySession } from '../middleware/authMiddleware.js'

// upload: middleware para recibir el archivo del documento
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router({ mergeParams: true })

// GET /api/viajes/:viajeId/documentos
// Devuelve todos los documentos de un viaje
router.get('/', verifySession, obtenerDocumentos)

// POST /api/viajes/:viajeId/documentos
// Sube un nuevo documento al viaje.
// upload.single('archivo') procesa el archivo antes del controlador.
router.post('/', verifySession, upload.single('archivo'), subirDocumento)

// DELETE /api/viajes/:viajeId/documentos/:id
// Elimina un documento específico por su id
router.delete('/:id', verifySession, eliminarDocumento)

export default router
