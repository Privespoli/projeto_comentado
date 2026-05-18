// =========================================================
// documentosController.js — Controlador de documentos
//
// Maneja la lógica para subir, listar y eliminar documentos
// adjuntos a un viaje (reservas, vouchers, PDFs, imágenes).
// Los archivos se guardan en el bucket "documentos" de
// Supabase Storage y su URL se registra en la BD.
// =========================================================

import supabase, { supabaseAdmin } from '../supabaseClient.js'

// subirDocumento: sube un archivo a Supabase Storage y registra
// sus metadatos en la tabla "documentos".
export const subirDocumento = async (req, res) => {
  const { viajeId } = req.params
  const { titulo, lugar, fecha } = req.body     // metadatos del documento
  const usuario_id = req.user.id

  try {
    // Obtiene la extensión del archivo (ej: "pdf", "jpg")
    const extension = req.file.originalname.split('.').pop()

    // Genera un nombre único usando milisegundos actuales
    const nombreArchivo = `${Date.now()}.${extension}`

    // Sube el archivo al bucket "documentos" de Supabase Storage
    const { error: errorStorage } = await supabaseAdmin.storage
      .from('documentos')
      .upload(nombreArchivo, req.file.buffer, {
        contentType: req.file.mimetype
      })

    if (errorStorage) throw new Error('Error al subir el archivo')

    // Obtiene la URL pública del archivo recién subido
    const { data: urlData } = supabaseAdmin.storage
      .from('documentos')
      .getPublicUrl(nombreArchivo)

    // Inserta el registro del documento en la base de datos
    // con los metadatos y la URL del archivo
    const { data, error } = await supabaseAdmin
      .from('documentos')
      .insert([{
        viaje_id: viajeId,
        usuario_id,
        titulo,
        lugar,
        fecha,
        archivo_url: urlData.publicUrl, // URL donde está guardado el archivo
        tipo: req.file.mimetype          // tipo MIME: "application/pdf", "image/jpeg", etc.
      }])
      .select()

    if (error) return res.status(400).json({ error: error.message })

    res.status(201).json({ message: 'Documento subido correctamente', documento: data[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// obtenerDocumentos: lista todos los documentos de un viaje.
export const obtenerDocumentos = async (req, res) => {
  const { viajeId } = req.params

  const { data, error } = await supabaseAdmin
    .from('documentos')
    .select('*')
    .eq('viaje_id', viajeId)

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ documentos: data })
}

// eliminarDocumento: elimina un documento de la BD por su ID.
// Nota: esto solo borra el registro en la BD, no el archivo de Storage.
export const eliminarDocumento = async (req, res) => {
  const { id } = req.params

  const { error } = await supabaseAdmin
    .from('documentos')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ message: 'Documento eliminado' })
}
