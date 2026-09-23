import { computed, ref } from 'vue'
import { useAdminUpload } from './useAdminUpload'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import type { Image } from '@/types'
import type { UploadFolder } from '@/types/admin'

interface Pending {
  id: number
  name: string
  preview: string
  progress: number
}

interface QueueOptions {
  images: () => Image[]
  folder: () => UploadFolder
  max: () => number
  onAdd: (next: Image[]) => void
}

let seq = 0

/** Cola de subida de una galería: vista previa local, progreso y tope de fotos. */
export function useAdminGalleryQueue(options: QueueOptions) {
  const toast = useToastStore()
  const { unavailable, uploadOne } = useAdminUpload()
  const pending = ref<Pending[]>([])

  const room = computed(() => options.max() - options.images().length - pending.value.length)

  function clearPending() {
    pending.value.forEach((x) => URL.revokeObjectURL(x.preview))
    pending.value = []
  }

  async function addFiles(list: FileList | File[]) {
    const files = Array.from(list).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    const max = options.max()
    if (room.value <= 0) return toast.error(`${adminCopy.upload.maxReached} (${max}).`)
    const accepted = files.slice(0, room.value)
    if (accepted.length < files.length) {
      toast.info(`Solo se subirán ${accepted.length}: el máximo es ${max}.`)
    }
    const queue = accepted.map((file) => ({
      file,
      item: { id: ++seq, name: file.name, preview: URL.createObjectURL(file), progress: 0 },
    }))
    pending.value.push(...queue.map((q) => q.item))

    // De a una: el orden final respeta el orden elegido y el v-model no compite.
    for (const { file, item } of queue) {
      const result = await uploadOne(file, options.folder(), 'image', (ratio) => {
        const p = pending.value.find((x) => x.id === item.id)
        if (p) p.progress = Math.round(ratio * 100)
      })
      pending.value = pending.value.filter((x) => x.id !== item.id)
      URL.revokeObjectURL(item.preview)
      if (result) options.onAdd([...options.images(), { url: result.url, publicId: result.publicId }])
      // Si el servicio no está configurado no tiene sentido seguir intentando.
      if (unavailable.value) return clearPending()
    }
  }

  return { pending, room, unavailable, addFiles }
}
