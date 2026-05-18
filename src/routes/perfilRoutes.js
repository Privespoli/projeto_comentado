// =========================================================
// perfilRoutes.js — Rutas del perfil de usuario
//
// Define los endpoints para ver y guardar el perfil
// del usuario autenticado (nombre, teléfono, foto).
// Prefijo base: /api/perfil  (definido en index.js)
// =========================================================

import express from 'express'
import { obtenerPerfil, guardarPerfil } from '../controllers/perfilController.js'
import { verifySession } from '../middleware/authMiddleware.js'

// upload: middleware para recibir la foto de perfil
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// GET /api/perfil
// Devuelve el perfil del usuario autenticado (nombre, teléfono, foto_url)
router.get('/', verifySession, obtenerPerfil)

// POST /api/perfil
// Crea o actualiza el perfil del usuario.
// upload.single('foto') procesa la imagen antes de llegar al controlador.
// Si el perfil ya existe, lo actualiza; si no, lo crea.
router.post('/', verifySession, upload.single('foto'), guardarPerfil)

export default router
