// =========================================================
// index.js — Punto de entrada del servidor
// Este archivo arranca la aplicación Express y registra
// todas las rutas de la API.
// =========================================================

// express: framework para crear el servidor web y definir rutas
import express from 'express'

// dotenv: carga las variables de entorno desde el archivo .env
// (contraseñas, URLs, claves que no deben estar hardcodeadas)
import dotenv from 'dotenv'

// cors: permite que el frontend (en otro puerto/dominio) pueda
// hacer peticiones a este servidor sin ser bloqueado por el navegador
import cors from 'cors'

// Importamos cada archivo de rutas (cada uno agrupa los endpoints
// de una funcionalidad específica de la app)
import authRoutes from './src/routes/authRoutes.js'           // login y registro
import viajesRoutes from './src/routes/viajesRoutes.js'       // CRUD de viajes
import integrantesRoutes from './src/routes/integrantesRoutes.js' // miembros de un viaje
import documentosRoutes from './src/routes/documentosRoutes.js'   // archivos adjuntos
import itinerarioRoutes from './src/routes/itinerarioRoutes.js'   // agenda del viaje
import poiRoutes from './src/routes/poiRoutes.js'             // lugares de interés (POI)
import perfilRoutes from './src/routes/perfilRoutes.js'       // perfil del usuario

// Carga las variables del archivo .env en process.env
dotenv.config()

// Crea la instancia principal de la aplicación Express
const app = express()

// Puerto donde escucha el servidor; usa el de .env o 3000 por defecto
const PORT = process.env.PORT || 3000

// ── Middlewares globales ──────────────────────────────────
// CORS: solo acepta peticiones desde estos orígenes (el frontend local)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176']
}))

// Permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json())

// ── Ruta de prueba ────────────────────────────────────────
// GET / → solo verifica que el servidor esté funcionando
app.get('/', (req, res) => {
  res.send('TravelApp API funcionando')
})

// ── Registro de rutas por módulo ─────────────────────────
// Cada app.use() conecta un prefijo de URL con su archivo de rutas.
// Ejemplo: una petición a /api/auth/login la maneja authRoutes.

app.use('/api/perfil', perfilRoutes)                              // /api/perfil
app.use('/api/auth', authRoutes)                                  // /api/auth
app.use('/api/viajes/:viajeId/integrantes', integrantesRoutes)   // /api/viajes/:id/integrantes
app.use('/api/viajes/:viajeId/documentos', documentosRoutes)     // /api/viajes/:id/documentos
app.use('/api/viajes', viajesRoutes)                              // /api/viajes
app.use('/api/itinerarios', itinerarioRoutes)                    // /api/itinerarios
app.use('/api/poi', poiRoutes)                                    // /api/poi

// ── Arranca el servidor ───────────────────────────────────
// Queda escuchando peticiones HTTP en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
