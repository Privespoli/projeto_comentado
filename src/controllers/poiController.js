// =========================================================
// poiController.js — Controlador de Puntos de Interés (POI)
//
// POI (Point of Interest): lugares que los integrantes de un
// viaje proponen y votan. Los POIs se listan ordenados por
// puntuación (más votados primero).
//
// Tablas usadas:
//   - lugares_poi  → los lugares propuestos
//   - votos_poi    → los votos de cada usuario sobre cada POI
// =========================================================

import supabase, { supabaseAdmin } from '../supabaseClient.js';

// crearLugarPOI: crea un nuevo POI asociado a un viaje.
// Recibe: nombre del lugar y viaje_id.
export const crearLugarPOI = async (req, res) => {
  const { nombre, viaje_id } = req.body;
  const creador_id = req.user.id; // ID del usuario que propone el lugar

  // Validación básica: nombre y viaje_id son obligatorios
  if (!nombre || !viaje_id) {
    return res.status(400).json({ error: 'Nombre e viaje_id são obrigatórios' });
  }

  try {
    const { data, error } = await supabase
      .from('lugares_poi')
      .insert([{
        nombre,
        viaje_id: Number(viaje_id), // asegura que sea número
        creador_id
      }])
      .select();

    if (error) {
      console.error("ERRO DETALHADO DO SUPABASE:", error);
      return res.status(400).json(error);
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("ERRO NO CATCH:", error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

// votarPOI: registra o actualiza el voto de un usuario sobre un POI.
// tipo puede ser 'up' (+1) o cualquier otro valor (-1).
//
// upsert: si ya existe un voto del mismo usuario para ese POI,
// lo actualiza en lugar de crear un duplicado (basado en poi_id + user_id).
export const votarPOI = async (req, res) => {
  const { poiId, tipo } = req.body; // tipo: 'up' o 'down'
  const user_id = req.user.id;

  // Convierte 'up' a 1 y cualquier otra cosa a -1
  const valorVoto = tipo === 'up' ? 1 : -1;

  try {
    const { data, error } = await supabase
      .from('votos_poi')
      .upsert(
        { poi_id: poiId, user_id, tipo_voto: valorVoto },
        { onConflict: 'poi_id, user_id' } // clave única: un voto por usuario por POI
      )
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Voto registrado com sucesso', data });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar voto' });
  }
};

// listarPOIsPorViaje: devuelve todos los POIs de un viaje
// junto con su puntuación calculada a partir de los votos.
export const listarPOIsPorViaje = async (req, res) => {
  const { viajeId } = req.params;

  try {
    // Hace una consulta con JOIN implícito: trae los POIs y sus votos anidados
    // La sintaxis de Supabase permite relacionar tablas con backticks en el select
    const { data, error } = await supabase
      .from('lugares_poi')
      .select(`
        *,
        votos_poi (
          tipo_voto
        )
      `)
      .eq('viaje_id', viajeId);

    if (error) return res.status(400).json({ error: error.message });

    // Calcula los votos positivos, negativos y totales para cada POI
    const poisComPontuacao = data.map(poi => {
      const votosPositivos = poi.votos_poi.filter(v => v.tipo_voto === 1).length;
      const votosNegativos = poi.votos_poi.filter(v => v.tipo_voto === -1).length;

      // reduce: suma todos los tipo_voto para obtener el total (puede ser negativo)
      const total = poi.votos_poi.reduce((acc, voto) => acc + voto.tipo_voto, 0);

      return {
        ...poi,
        votos_positivos: votosPositivos,
        votos_negativos: votosNegativos,
        puntuacion_total: total
      };
    });

    // Ordena los POIs de mayor a menor puntuación
    poisComPontuacao.sort((a, b) => b.puntuacion_total - a.puntuacion_total);

    res.status(200).json(poisComPontuacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar POIs' });
  }
};

// eliminarPOI: elimina un POI por su ID.
// Usa supabaseAdmin para saltarse RLS.
export const eliminarPOI = async (req, res) => {
  const { poiId } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from('lugares_poi')
      .delete()
      .eq('id', poiId);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: 'POI eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
};
