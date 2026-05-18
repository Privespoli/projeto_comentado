// =========================================================
// supabaseClient.js — Conexión a la base de datos Supabase
//
// Supabase es el servicio de base de datos y autenticación
// que usa esta app. Aquí se crean dos "clientes" (conexiones):
//   - supabase       → cliente normal con permisos de usuario
//   - supabaseAdmin  → cliente con permisos de administrador
//                      (puede saltarse las reglas de seguridad RLS)
// =========================================================

// createClient: función de Supabase que crea una conexión a la BD
import { createClient } from '@supabase/supabase-js'

// dotenv: carga las variables secretas desde el archivo .env
import dotenv from 'dotenv'

dotenv.config()

// Lee las credenciales desde las variables de entorno (.env)
const supabaseUrl = process.env.SUPABASE_URL          // URL del proyecto Supabase
const supabaseKey = process.env.SUPABASE_ANON_KEY     // Clave pública (acceso restringido por RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY // Clave secreta de servicio (acceso total)

// Cliente estándar: usado en operaciones normales donde las reglas
// de seguridad (Row Level Security) deben aplicarse
const supabase = createClient(supabaseUrl, supabaseKey)

// Cliente administrador: usa la service key para saltarse RLS.
// Se usa cuando el servidor necesita acceder a datos de cualquier
// usuario sin restricciones (ej: buscar un usuario por email).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Exportación por defecto: el cliente estándar (el más usado)
export default supabase
