// =========================================================
// viajesController.js — Controlador de viajes
//
// Maneja la lógica para crear, listar y actualizar viajes.
// Usa supabaseAdmin para consultas que necesitan saltarse RLS
// (como leer viajes de otros usuarios al ser integrante).
// =========================================================

import supabase, { supabaseAdmin } from '../supabaseClient.js'

// crearViaje: crea un nuevo viaje en la base de datos.
// Si viene una imagen, la sube primero a Supabase Storage.
export const crearViaje = async (req, res) => {
  // Datos del formulario del nuevo viaje
  const { titulo, destino, fecha_inicio, fecha_fin } = req.body

  // El id del usuario autenticado (viene del middleware verifySession)
  const titular_id = req.user.id
  let imagen_url = null

  try {
    // Si el usuario envió una imagen (req.file viene de multer)
    if (req.file) {
      // Obtiene la extensión del archivo (ej: "jpg", "png")
      const extension = req.file.originalname.split('.').pop()

      // Genera un nombre único usando la fecha actual en milisegundos
      const nombreArchivo = `${Date.now()}.${extension}`

      // Sube el archivo al bucket "imagenes-viajes" de Supabase Storage
      // req.file.buffer es el archivo en memoria RAM (gracias a memoryStorage)
      const { error: errorStorage } = await supabaseAdmin.storage
        .from('imagenes-viajes')
        .upload(nombreArchivo, req.file.buffer, {
          contentType: req.file.mimetype
        })

      if (errorStorage) throw new Error('Error al subir la imagen')

      // Obtiene la URL pública de la imagen recién subida
      const { data } = supabase.storage
        .from('imagenes-viajes')
        .getPublicUrl(nombreArchivo)

      imagen_url = data.publicUrl
    }

    // Inserta el nuevo viaje en la tabla "viajes" de la BD
    // Estado inicial: "planificacion"
    const { data, error } = await supabase
      .from('viajes')
      .insert([{ titulo, destino, fecha_inicio, fecha_fin, imagen_url, titular_id, estado: 'planificacion' }])
      .select() // .select() devuelve el registro insertado

    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json({ message: 'Viaje creado correctamente', viaje: data[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// obtenerViajes: devuelve todos los viajes del usuario autenticado.
// Combina los viajes donde es titular y los que pertenece como integrante.
export const obtenerViajes = async (req, res) => {
  const user_id = req.user.id

  // 1. Busca viajes donde el usuario es el titular (creador)
  const { data: viajesComoTitular, error: error1 } = await supabase
    .from('viajes')
    .select('*')
    .eq('titular_id', user_id)

  if (error1) return res.status(400).json({ error: error1.message })

  // 2. Busca los IDs de viajes donde el usuario aparece como integrante
  const { data: integrantes, error: error2 } = await supabaseAdmin
    .from('integrantes')
    .select('viaje_id')
    .eq('usuario_id', user_id)

  if (error2) return res.status(400).json({ error: error2.message })

  let viajesComoIntegrante = []

  // 3. Si pertenece a algún viaje como integrante, los busca por ID
  if (integrantes.length > 0) {
    const ids = integrantes.map(i => i.viaje_id) // extrae solo los IDs
    const { data, error: error3 } = await supabaseAdmin
      .from('viajes')
      .select('*')
      .in('id', ids) // .in() filtra por múltiples valores

    if (error3) return res.status(400).json({ error: error3.message })
    viajesComoIntegrante = data
  }

  // 4. Une ambas listas, elimina duplicados y ordena por fecha de creación (más reciente primero)
  const todos = [...viajesComoTitular, ...viajesComoIntegrante]
  const unicos = todos.filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i)
  const ordenados = unicos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  res.status(200).json({ viajes: ordenados })
}

// obtenerViaje: devuelve los datos de un viaje específico por su ID.
// Usa supabaseAdmin para saltarse RLS y permitir que integrantes también lo vean.
export const obtenerViaje = async (req, res) => {
  const { id } = req.params // lee el :id de la URL

  const { data, error } = await supabaseAdmin
    .from('viajes')
    .select('*')
    .eq('id', id)
    .single() // .single() espera exactamente un resultado

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ viaje: data })
}

// actualizarViaje: actualiza el estado de un viaje (ej: "en curso", "finalizado").
// Solo el titular puede hacerlo: el .eq('titular_id', titular_id) lo garantiza.
export const actualizarViaje = async (req, res) => {
  const { id } = req.params
  const { estado } = req.body
  const titular_id = req.user.id

  // Actualiza solo si el viaje pertenece al usuario autenticado
  const { data, error } = await supabase
    .from('viajes')
    .update({ estado })
    .eq('id', id)
    .eq('titular_id', titular_id) // doble condición: id Y titular_id
    .select()

  if (error) return res.status(400).json({ error: error.message })
  if (!data.length) return res.status(404).json({ error: 'Viaje no encontrado' })
  res.status(200).json({ message: 'Viaje actualizado', viaje: data[0] })
}
