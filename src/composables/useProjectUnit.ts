import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { projectService } from '@/services/project.service'
import { useAsyncData } from './useAsyncData'
import { useSeo } from './useSeo'
import { useListingWhatsApp } from './useWhatsAppContext'
import { useCatalogStore } from '@/stores/catalog'
import { sentenceCase } from '@/utils/format'
import { copy } from '@/config/copy.public'
import type { Image } from '@/types'

/** Ficha de una unidad del inventario: datos, galería (plano primero), SEO y WhatsApp. */
export function useProjectUnit() {
  const route = useRoute()
  const catalog = useCatalogStore()
  const slug = computed(() => String(route.params.slug || ''))
  const unitId = computed(() => String(route.params.unitId || ''))

  const detail = useAsyncData(() => projectService.getUnit(slug.value, unitId.value))
  const { setListing, href: whatsappHref } = useListingWhatsApp()

  const project = computed(() => detail.data.value?.project ?? null)
  const unit = computed(() => detail.data.value?.unit ?? null)
  const projectTitle = computed(() => sentenceCase(project.value?.title ?? ''))
  const listingTitle = computed(() => (unit.value ? `${projectTitle.value} - ${unit.value.name}` : ''))
  const refCode = computed(() =>
    project.value && unit.value ? `${project.value.code} / ${unit.value.name}` : '',
  )

  // El plano va primero: es lo que la clienta quiere que se vea.
  const images = computed<Image[]>(() => {
    const u = unit.value
    if (!u) return []
    return u.floorPlan ? [u.floorPlan, ...u.images] : [...u.images]
  })

  watch(
    [slug, unitId],
    () => {
      catalog.ensureBasics()
      detail.load()
    },
    { immediate: true },
  )

  watch(refCode, (code) => {
    if (code) setListing(listingTitle.value, code)
  })

  useSeo(() => ({
    title: listingTitle.value || copy.unit.back,
    description: unit.value?.description || project.value?.summary,
    image: images.value[0]?.url || project.value?.cover,
  }))

  return { slug, detail, project, unit, projectTitle, listingTitle, refCode, images, whatsappHref }
}
