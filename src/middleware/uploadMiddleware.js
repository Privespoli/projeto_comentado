// =========================================================
// uploadMiddleware.js — Middleware para subida de archivos
//
// Usa la librería "multer" para interceptar peticiones que
// incluyen archivos (imágenes, PDFs, etc.) antes de que
// lleguen al controlador.
// El archivo queda disponible en req.file dentro del controlador.
// =========================================================

// multer: librería para manejar archivos enviados con formularios
// (peticiones de tipo multipart/form-data)
import multer from 'multer'

// memoryStorage: guarda el archivo en la memoria RAM (como un Buffer)
// en lugar de guardarlo en disco. Así podemos enviarlo directamente
// a Supabase Storage sin crear archivos temporales.
const storage = multer.memoryStorage()

// Configuración del middleware de subida
const upload = multer({
  storage,

  // Límite de tamaño: máximo 5 MB por archivo (5 * 1024 * 1024 bytes)
  limits: { fileSize: 5 * 1024 * 1024 },

  // fileFilter: función que decide si aceptar o rechazar el archivo
  // según su tipo MIME
  fileFilter: (req, file, cb) => {
    // Solo acepta imágenes JPEG o PNG
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)  // null = sin error, true = aceptar archivo
    } else {
      cb(new Error('Solo se permiten imágenes JPG o PNG'))
    }
  }
})

// Exporta la instancia configurada de multer.
// Se usa en las rutas así: upload.single('nombreDelCampo')
export default upload
