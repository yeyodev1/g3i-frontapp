import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import type { ApiError, UploadResult } from '@/types'
import type { UploadFolder, UploadKind } from '@/types/admin'

// Límites del backend, en MB. Se validan antes para no subir 90 MB y fallar.
const LIMITS: Record<UploadKind, number> = { image: 10, video: 100, raw: 20 }

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
    if (file.size > limit * 1024 * 1024) {
      toast.error(`"${file.name}" ${adminCopy.upload.tooBig} (máximo ${limit} MB).`)
      return null
    }
    try {
      const result = await adminService.upload(file, folder, kind, onProgress)
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
