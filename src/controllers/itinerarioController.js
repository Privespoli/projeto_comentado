// =========================================================
// itinerarioController.js — Controlador del itinerario
//
// Maneja la agenda de un viaje: eventos con nombre de lugar,
// dirección, fecha y hora. Usa supabaseAdmin (importado
// como "supabase") para saltarse RLS en todos los casos.
// =========================================================

// Nota: aquí se importa supabaseAdmin pero se renombra a "supabase"
// para simplificar el código dentro de este archivo
import { supabaseAdmin as supabase } from '../supabaseClient.js'

// obtenerItinerario: devuelve todos los eventos del itinerario de un viaje,
// ordenados por fecha y luego por hora.
export const obtenerItinerario = async (req, res) => {
  const { id } = req.params // ID del viaje desde la URL

  try {
    const { data, error } = await supabase
      .from('itinerarios')
      .select('*')
      .eq('viaje_id', Number(id)) // convierte el string de la URL a número
      .order('fecha', { ascending: true }) // ordena primero por fecha
      .order('hora', { ascending: true })  // luego por hora

    if (error) {
      console.log("❌ ERRO AO BUSCAR ITINERÁRIO:", error);
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json({ itinerario: data })
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// agregarItinerario: añade un nuevo evento al itinerario de un viaje.
// Recibe: nombre del lugar, dirección (opcional), fecha y hora.
export const agregarItinerario = async (req, res) => {
  const { id } = req.params
  const { nombre_local, direccion, fecha, hora } = req.body

  try {
    const { data, error } = await supabase
      .from('itinerarios')
      .insert([{
        viaje_id: Number(id),
        nombre_local,
        direccion: direccion || null, // si no se envía, guarda null
        fecha,
        hora
      }])
      .select()

    if (error) {
      console.log("❌ ERRO AO INSERIR:", error);
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({ message: 'Evento añadido al itinerario', item: data[0] })

  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// eliminarItinerario: elimina un evento del itinerario por su ID.
export const eliminarItinerario = async (req, res) => {
  const { itemId } = req.params

  try {
    const { error } = await supabase
      .from('itinerarios')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.log("❌ ERRO AO DELETAR ITEM:", error);
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json({ message: 'Evento eliminado correctamente' })
  } catch (err) {
    console.error("Erro interno ao deletar:", err);
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
