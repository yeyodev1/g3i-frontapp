import { useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { useAdminConfirm } from './useAdminConfirm'
import { adminCopy } from '@/config/copy.admin'
import type { ApiError } from '@/types'

interface Listable {
  _id: string
  title: string
  slug: string
  status: string
  isFeatured: boolean
  featuredOrder?: number
}

interface Hooks<T> {
  replace: (item: T) => void
  removeLocal: (id: string) => void
}

const statusToast: Record<string, string> = {
  published: 'Publicada: ya está visible en el sitio.',
  hidden: 'Oculta: ya no aparece en el sitio.',
  sold: 'Marcada como vendida.',
  'sold-out': 'Marcado como agotado.',
  draft: 'Pasó a borrador.',
}

/** Acciones rápidas de los listados de propiedades y proyectos. */
export function useAdminListingActions<T extends Listable>(
  kind: 'property' | 'project',
  hooks: Hooks<T>,
) {
  const router = useRouter()
  const toast = useToastStore()
  const { confirm } = useAdminConfirm()

  async function setStatus(item: T, status: string) {
    try {
      const updated =
        kind === 'property'
          ? await adminService.setPropertyStatus(item._id, status as 'published')
          : await adminService.setProjectStatus(item._id, status as 'published')
      hooks.replace({ ...item, ...(updated as object), status } as T)
      toast.success(statusToast[status] ?? adminCopy.form.saved)
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  async function markSold(item: T) {
    const target = kind === 'property' ? 'sold' : 'sold-out'
    const ok = await confirm({
      title: kind === 'property' ? '¿Marcar como vendida?' : '¿Marcar como agotado?',
      message: 'Dejará de aparecer en el sitio. Puedes cambiarlo después si te equivocas.',
      confirmLabel: 'Sí, marcar',
    })
    if (ok) await setStatus(item, target)
  }

  async function toggleFeatured(item: T) {
    const next = !item.isFeatured
    try {
      const updated =
        kind === 'property'
          ? await adminService.setPropertyFeatured(item._id, next, item.featuredOrder ?? 999)
          : await adminService.setProjectFeatured(item._id, next, item.featuredOrder ?? 999)
      hooks.replace({ ...item, ...(updated as object), isFeatured: next } as T)
      toast.success(next ? 'Ahora aparece en destacadas.' : 'Se quitó de destacadas.')
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  async function remove(item: T) {
    const ok = await confirm({
      title: adminCopy.delete.title,
      message: `"${item.title}". ${kind === 'property' ? adminCopy.delete.property : adminCopy.delete.project}`,
      confirmLabel: adminCopy.delete.confirm,
      danger: true,
    })
    if (!ok) return
    try {
      if (kind === 'property') await adminService.deleteProperty(item._id)
      else await adminService.deleteProject(item._id)
      hooks.removeLocal(item._id)
      toast.success(adminCopy.delete.done)
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  function viewOnSite(item: T) {
    const name = kind === 'property' ? 'PropertyDetail' : 'ProjectDetail'
    window.open(router.resolve({ name, params: { slug: item.slug } }).href, '_blank')
  }

  return { setStatus, markSold, toggleFeatured, remove, viewOnSite }
}
