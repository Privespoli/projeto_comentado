// =========================================================
// authRoutes.js — Rutas de autenticación
//
// Define los endpoints HTTP relacionados con el acceso de
// usuarios: login, registro y verificar sesión activa.
// Prefijo base: /api/auth  (definido en index.js)
// =========================================================

import express from 'express'

// Importa las funciones controladoras que manejan cada acción
import { login, registro } from '../controllers/authController.js'

// Importa el middleware que verifica si hay sesión activa
import { verifySession } from '../middleware/authMiddleware.js'

// Crea un mini-router de Express para agrupar estas rutas
const router = express.Router()

// POST /api/auth/login
// Recibe email y password, devuelve el token de sesión si son correctos
router.post('/login', login)

// POST /api/auth/registro
// Recibe email y password, crea una cuenta nueva en Supabase
router.post('/registro', registro)

// GET /api/auth/me
// Ruta protegida: primero pasa por verifySession (verifica el token),
// luego devuelve los datos del usuario autenticado
router.get('/me', verifySession, (req, res) => {
  res.status(200).json({
    message: 'Sesión válida',
    user: req.user   // req.user fue asignado por el middleware verifySession
  })
})

export default router
