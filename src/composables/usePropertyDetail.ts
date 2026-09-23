import { computed, ref, watch } from 'vue'
import { useAsyncData } from './useAsyncData'
import { useListingWhatsApp } from './useWhatsAppContext'
import { useSeo } from './useSeo'
import { propertyService } from '@/services/property.service'
import { useCatalogStore } from '@/stores/catalog'
import { detailSpecs } from '@/utils/specs'
import { propertySchema } from '@/utils/schema'
import { sentenceCase } from '@/utils/format'
import { copy } from '@/config/copy.public'
import { copyProperties } from '@/config/copy.properties'
import type { PropertyCard } from '@/types'

/** Ficha de una propiedad: carga, relacionadas, specs, WhatsApp con código y SEO. */
export function usePropertyDetail(slug: () => string) {
  const catalog = useCatalogStore()
  const { data: property, loading, error, notFound, load } = useAsyncData(() =>
    propertyService.getBySlug(slug()),
  )
  const related = ref<PropertyCard[]>([])
  const { setListing, href: whatsappHref } = useListingWhatsApp()

  async function fetchAll() {
    related.value = []
    await load()
    if (!property.value) return
    const current = slug()
    propertyService
      .related(current)
      .then((items) => {
        if (current === slug()) related.value = items
      })
      .catch(() => {
        related.value = []
      })
  }

  watch(slug, fetchAll, { immediate: true })

  const title = computed(() => sentenceCase(property.value?.title ?? ''))
  // «Tumbaco · Auki Plaza»: sector y subzona; sin subzona, la ciudad.
  const place = computed(() => {
    const p = property.value
    if (!p) return ''
    return [catalog.sectorLabel(p.sector), p.locality || copy.common.city].join(' · ')
  })
  const specs = computed(() =>
    property.value ? detailSpecs(property.value, catalog.conditionLabel(property.value.condition)) : [],
  )
  const hasLocation = computed(
    () => property.value?.location.lat !== null && property.value?.location.lat !== undefined && property.value?.location.lng !== null,
  )
  const leadMessage = computed(() =>
    property.value ? copy.form.interestedIn(title.value, property.value.code) : '',
  )

  watch(property, (p) => {
    if (p) setListing(title.value, p.code)
  })

  useSeo(() => {
    const p = property.value
    if (!p) return { title: notFound.value ? copy.property.notFoundTitle : copyProperties.back }
    const typeText = `${catalog.typeLabel(p.type)} ${copyProperties.inSale} ${copyProperties.in} ${catalog.sectorLabel(p.sector)}`
    const url = `${window.location.origin}${window.location.pathname}`
    return {
      title: title.value,
      description: p.summary || typeText,
      image: p.images[0]?.url,
      jsonLd: propertySchema(p, title.value, catalog.sectorLabel(p.sector), url),
    }
  })

  return {
    property,
    loading,
    error,
    notFound,
    related,
    title,
    place,
    specs,
    hasLocation,
    leadMessage,
    whatsappHref,
    reload: fetchAll,
  }
}
