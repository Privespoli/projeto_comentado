// =========================================================
// integrantesController.js — Controlador de integrantes
//
// Maneja la lógica para ver, agregar y eliminar integrantes
// de un viaje. Solo el titular del viaje puede agregar
// o eliminar integrantes.
// =========================================================

import supabase, { supabaseAdmin } from '../supabaseClient.js'

// obtenerIntegrantes: lista todos los miembros de un viaje
// con su email y nombre de perfil.
export const obtenerIntegrantes = async (req, res) => {
  const { viajeId } = req.params // ID del viaje desde la URL

  // Obtiene todos los registros de la tabla "integrantes" para este viaje
  const { data, error } = await supabase
    .from('integrantes')
    .select('*')
    .eq('viaje_id', viajeId)

  if (error) return res.status(400).json({ error: error.message })

  // Por cada integrante, busca su email (en Supabase Auth) y nombre (en tabla perfiles)
  // Promise.all ejecuta todas las búsquedas en paralelo para mayor velocidad
  const integrantesConEmail = await Promise.all(
    data.map(async (integrante) => {
      // supabaseAdmin.auth.admin.getUserById: obtiene datos de Auth por UUID
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(integrante.usuario_id)

      // Busca el nombre del perfil del usuario en la tabla "perfiles"
      const { data: perfil } = await supabaseAdmin
        .from('perfiles')
        .select('nombre')
        .eq('id', integrante.usuario_id)
        .single()

      // Devuelve el integrante original más el email y nombre agregados
      return {
        ...integrante,         // copia todos los campos originales
        email: user?.email,    // el ?. evita error si user es null
        nombre: perfil?.nombre || null
      }
    })
  )

  res.status(200).json({ integrantes: integrantesConEmail })
}

// agregarIntegrante: agrega un usuario al viaje buscándolo por email.
// Solo el titular del viaje puede hacer esto.
export const agregarIntegrante = async (req, res) => {
  const { viajeId } = req.params
  const { email } = req.body
  const titular_id = req.user.id

  // Verifica que el viaje existe y que el usuario autenticado es el titular
  const { data: viaje, error: errorViaje } = await supabase
    .from('viajes')
    .select('titular_id')
    .eq('id', viajeId)
    .single()

  // Si no es el titular, rechaza con 403 Forbidden
  if (errorViaje || viaje.titular_id !== titular_id) {
    return res.status(403).json({ error: 'Solo el titular puede añadir integrantes' })
  }

  // Busca al usuario por email en la lista de usuarios de Supabase Auth
  // listUsers devuelve hasta 1000 usuarios (limitación de la API)
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000
  })

  // Encuentra el usuario cuyo email coincide con el enviado
  const usuario = users.find(u => u.email === email)

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  // Inserta el nuevo integrante con rol "integrante"
  const { data, error } = await supabase
    .from('integrantes')
    .insert([{
      viaje_id: viajeId,
      usuario_id: usuario.id,
      rol: 'integrante'
    }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ message: 'Integrante añadido', integrante: data[0] })
}

// eliminarIntegrante: elimina un integrante del viaje por su ID.
// Solo el titular puede hacerlo.
export const eliminarIntegrante = async (req, res) => {
  const { viajeId, integranteId } = req.params
  const titular_id = req.user.id

  // Verifica que el usuario autenticado es el titular del viaje
  const { data: viaje, error: errorViaje } = await supabase
    .from('viajes')
    .select('titular_id')
    .eq('id', viajeId)
    .single()

  if (errorViaje || viaje.titular_id !== titular_id) {
    return res.status(403).json({ error: 'Solo el titular puede eliminar integrantes' })
  }

  // Elimina el registro de la tabla "integrantes"
  const { error } = await supabase
    .from('integrantes')
    .delete()
    .eq('id', integranteId)
    .eq('viaje_id', viajeId) // condición extra de seguridad

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ message: 'Integrante eliminado' })
}
