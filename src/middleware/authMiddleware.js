// =========================================================
// authMiddleware.js — Verificación de sesión (Middleware)
//
// Un MIDDLEWARE es una función que se ejecuta ENTRE que llega
// la petición HTTP y que el controlador la procesa.
// Este middleware protege las rutas: si el usuario no tiene
// una sesión válida, la petición se rechaza antes de llegar
// al controlador.
// =========================================================

import supabase from '../supabaseClient.js'

// verifySession: middleware que verifica el token JWT del usuario.
// Se agrega a cualquier ruta que requiera que el usuario esté logueado.
//
// Parámetros:
//   req  → objeto de la petición (contiene headers, body, params, etc.)
//   res  → objeto de respuesta (permite enviar datos al cliente)
//   next → función que, al llamarse, pasa el control al siguiente paso
export const verifySession = async (req, res, next) => {
  // Lee el header "Authorization" de la petición HTTP.
  // El frontend debe enviarlo así: Authorization: Bearer <token>
  const authHeader = req.headers['authorization']

  // Si no hay header de autorización, rechaza la petición
  if (!authHeader) {
    return res.status(401).json({ error: 'No hay token de sesión' })
  }

  // El header tiene el formato "Bearer <token>", así que separamos
  // por el espacio y tomamos la segunda parte (el token)
  const token = authHeader.split(' ')[1]

  // Le pregunta a Supabase si el token es válido y obtiene el usuario
  const { data, error } = await supabase.auth.getUser(token)

  // Si el token es inválido o expiró, rechaza la petición
  if (error || !data.user) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' })
  }

  // Si el token es válido, guarda los datos del usuario en req.user
  // para que los controladores puedan usarlos (ej: req.user.id)
  req.user = data.user

  // Llama a next() para que la petición continúe hacia el controlador
  next()
}
