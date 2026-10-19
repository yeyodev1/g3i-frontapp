import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import { compressImage, isCompressibleImage } from '@/utils/compressImage'
import type { ApiError, UploadResult } from '@/types'
import type { UploadFolder, UploadKind } from '@/types/admin'

// Límites del backend, en MB. Se validan antes para no subir 90 MB y fallar.
const LIMITS: Record<UploadKind, number> = { image: 10, video: 100, raw: 20 }

const MB = 1024 * 1024
const inMb = (bytes: number) => (bytes / MB).toFixed(1)

// Compartido: si Cloudinary no está configurado, todos los campos de archivo lo avisan.
const unavailable = ref(false)

export function useAdminUpload() {
  const toast = useToastStore()

  async function uploadOne(
    file: File,
    folder: UploadFolder,
    kind: UploadKind,
    onProgress?: (ratio: number) => void,
  ): Promise<UploadResult | null> {
    const limit = LIMITS[kind]
    let upload = file
    if (file.size > limit * MB) {
      // Las fotos pesadas se comprimen solas; lo que no se puede comprimir
      // (PDF, video, GIF) falla con el peso real y el máximo a la vista.
      if (kind === 'image' && isCompressibleImage(file)) {
        const compressed = await compressImage(file, limit * MB)
        if (!compressed) {
          toast.error(
            `"${file.name}" pesa ${inMb(file.size)} MB y ${adminCopy.upload.compressFailed} ` +
              `(máximo ${limit} MB). ${adminCopy.upload.reduceHint}`,
          )
          return null
        }
        toast.info(
          `"${file.name}" ${adminCopy.upload.compressed} (${inMb(file.size)} → ${inMb(compressed.size)} MB).`,
        )
        upload = compressed
      } else {
        toast.error(
          `"${file.name}" ${adminCopy.upload.tooBig}: pesa ${inMb(file.size)} MB y el máximo ` +
            `es ${limit} MB. ${adminCopy.upload.reduceHint}`,
        )
        return null
      }
    }
    try {
      const result = await adminService.upload(upload, folder, kind, onProgress)
      unavailable.value = false
      return result
    } catch (e) {
      const error = e as ApiError
      if (error.status === 503) {
        unavailable.value = true
        toast.error(adminCopy.upload.unavailable)
      } else {
        toast.error(`${adminCopy.upload.failed} "${file.name}": ${error.message}`)
      }
      return null
    }
  }

  return { unavailable, uploadOne }
}
