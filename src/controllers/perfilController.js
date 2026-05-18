// =========================================================
// perfilController.js — Controlador del perfil de usuario
//
// Maneja la lógica para consultar y guardar el perfil
// del usuario autenticado. Si el perfil ya existe lo
// actualiza (UPDATE); si no, lo crea (INSERT).
// =========================================================

import { supabaseAdmin } from '../supabaseClient.js'

// obtenerPerfil: devuelve el perfil del usuario autenticado.
// Si el usuario todavía no tiene perfil, devuelve null (sin error).
export const obtenerPerfil = async (req, res) => {
  const usuario_id = req.user.id // viene del middleware verifySession

  const { data, error } = await supabaseAdmin
    .from('perfiles')
    .select('*')
    .eq('id', usuario_id)
    .single()

  // PGRST116 es el código de Supabase para "no se encontró ningún registro".
  // No es un error real, simplemente el usuario no tiene perfil aún.
  if (error && error.code !== 'PGRST116') {
    return res.status(400).json({ error: error.message })
  }

  res.status(200).json({ perfil: data || null })
}

// guardarPerfil: crea o actualiza el perfil del usuario.
// Si se envía una foto, la sube primero a Supabase Storage.
export const guardarPerfil = async (req, res) => {
  const usuario_id = req.user.id
  const { nombre, telefono } = req.body
  let foto_url = null

  try {
    // Si viene una foto adjunta (procesada por multer)
    if (req.file) {
      const extension = req.file.originalname.split('.').pop()

      // El nombre del archivo usa el ID del usuario para que cada usuario
      // tenga su propio archivo y las actualizaciones sobreescriban el anterior
      const nombreArchivo = `${usuario_id}.${extension}`

      // Sube la foto al bucket "avatares".
      // upsert: true → si ya existe un archivo con ese nombre, lo reemplaza
      const { error: errorStorage } = await supabaseAdmin.storage
        .from('avatares')
        .upload(nombreArchivo, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        })

      if (errorStorage) throw new Error('Error al subir la foto')

      // Obtiene la URL pública de la foto
      const { data } = supabaseAdmin.storage
        .from('avatares')
        .getPublicUrl(nombreArchivo)

      foto_url = data.publicUrl
    }

    // Verifica si el usuario ya tiene un perfil en la BD
    const { data: perfilExistente } = await supabaseAdmin
      .from('perfiles')
      .select('id')
      .eq('id', usuario_id)
      .single()

    let data, error

    if (perfilExistente) {
      // El perfil ya existe → lo ACTUALIZA
      const updates = { nombre, telefono }
      if (foto_url) updates.foto_url = foto_url // solo actualiza la foto si se subió una nueva

      const result = await supabaseAdmin
        .from('perfiles')
        .update(updates)
        .eq('id', usuario_id)
        .select()

      data = result.data
      error = result.error
    } else {
      // No existe → CREA uno nuevo
      const insert = { id: usuario_id, nombre, telefono }
      if (foto_url) insert.foto_url = foto_url

      const result = await supabaseAdmin
        .from('perfiles')
        .insert([insert])
        .select()

      data = result.data
      error = result.error
    }

    if (error) return res.status(400).json({ error: error.message })

    res.status(200).json({ mensaje: 'Perfil guardado', perfil: data[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
