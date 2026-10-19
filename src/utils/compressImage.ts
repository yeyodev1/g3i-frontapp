/**
 * Compresión en el navegador para fotos que superan el límite del plan de
 * Cloudinary. Se recodifica la imagen en un canvas bajando lado y calidad
 * hasta que quepa. GIF (perdería la animación) y SVG (vectorial) se
 * romperían al recodificar, así que quedan fuera.
 */
const COMPRESSIBLE = /^image\/(jpeg|png|webp|avif)$/

// Escalones de lado máximo (px) y calidad JPEG: gana el primero que quepa.
// 2560 px sobra para pantalla; los últimos sacrifican calidad antes que fallar.
const STEPS: Array<[number, number]> = [
  [2560, 0.85],
  [2560, 0.7],
  [2048, 0.7],
  [2048, 0.55],
  [1600, 0.55],
]

export function isCompressibleImage(file: File): boolean {
  return COMPRESSIBLE.test(file.type)
}

function encode(bitmap: ImageBitmap, maxSide: number, quality: number): Promise<Blob | null> {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) return Promise.resolve(null)
  // JPEG no tiene transparencia: el fondo se aplana a blanco, no a negro.
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

/** Devuelve un File bajo `maxBytes`, o null si ni el escalón más agresivo cupo. */
export async function compressImage(file: File, maxBytes: number): Promise<File | null> {
  if (!isCompressibleImage(file)) return null
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return null
  }
  try {
    for (const [maxSide, quality] of STEPS) {
      const blob = await encode(bitmap, maxSide, quality)
      if (blob && blob.size <= maxBytes) {
        const name = file.name.replace(/\.[a-z0-9]+$/i, '') + '.jpg'
        return new File([blob], name, { type: 'image/jpeg' })
      }
    }
    return null
  } finally {
    bitmap.close()
  }
}
