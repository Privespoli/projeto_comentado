// =========================================================
// authController.js — Controlador de autenticación
//
// Un CONTROLADOR contiene la lógica de negocio de cada
// endpoint. Recibe la petición (req), realiza operaciones
// (aquí, contra Supabase Auth) y devuelve una respuesta (res).
// =========================================================

import supabase from '../supabaseClient.js'

// login: inicia sesión con email y contraseña.
// API usada: supabase.auth.signInWithPassword()
// Responde con los datos del usuario y la sesión (que incluye el token JWT)
export const login = async (req, res) => {
  // Extrae email y password del cuerpo de la petición
  const { email, password } = req.body

  // Llama a la API de autenticación de Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  // Si hay error (credenciales incorrectas, usuario no existe, etc.)
  if (error) {
    return res.status(401).json({ error: error.message })
  }

  // Responde con 200 OK, los datos del usuario y la sesión
  // data.session contiene el token JWT que el frontend debe guardar
  res.status(200).json({
    message: 'Login exitoso',
    user: data.user,
    session: data.session
  })
}

// registro: crea una cuenta nueva en Supabase Auth.
// API usada: supabase.auth.signUp()
// Supabase envía un email de confirmación automáticamente.
export const registro = async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  // Si hay error (email ya registrado, contraseña débil, etc.)
  if (error) {
    return res.status(400).json({ error: error.message })
  }

  // Responde con 201 Created y los datos del nuevo usuario
  res.status(201).json({
    message: 'Usuario creado correctamente',
    user: data.user
  })
}
