// =========================================================
// registerController.js — Controlador de registro (alternativo)
//
// Este archivo es una versión alternativa del registro de usuarios.
// La funcionalidad es idéntica a "registro" en authController.js.
// Ambos usan supabase.auth.signUp() para crear la cuenta.
// =========================================================

import supabase from '../../supabaseClient.js'

// register: crea una cuenta nueva en Supabase Auth.
// Recibe email y password en el cuerpo de la petición.
export const register = async (req, res) => {
  const { email, password } = req.body

  // signUp: crea el usuario en Supabase Auth y envía email de confirmación
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  // Responde con 201 Created y los datos del usuario recién creado
  res.status(201).json({
    message: 'Usuário registrado com sucesso!',
    user: data.user
  })
}
