import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { projectService } from '@/services/project.service'
import { useAsyncData } from './useAsyncData'
import { useSeo } from './useSeo'
import { useListingWhatsApp } from './useWhatsAppContext'
import { useCatalogStore } from '@/stores/catalog'
import { sentenceCase } from '@/utils/format'
import { projectSchema } from '@/utils/schema'
import { site } from '@/config/site'
import type { ProjectCard } from '@/types'

/** Carga de la ficha de un proyecto: datos, relacionados, SEO y WhatsApp. */
export function useProjectDetail() {
  const route = useRoute()
  const catalog = useCatalogStore()
  const slug = computed(() => String(route.params.slug || ''))

  const detail = useAsyncData(() => projectService.getBySlug(slug.value))
  const related = useAsyncData<ProjectCard[]>(() => projectService.related(slug.value).catch(() => []))
  const { setListing, href: whatsappHref } = useListingWhatsApp()

  const project = computed(() => detail.data.value?.project ?? null)
  const units = computed(() => detail.data.value?.units ?? [])
  const title = computed(() => sentenceCase(project.value?.title ?? ''))

  watch(
    slug,
    (value) => {
      if (!value) return
      catalog.ensureBasics()
      detail.load()
      related.load()
    },
    { immediate: true },
  )

  watch(project, (p) => {
    if (p) setListing(sentenceCase(p.title), p.code)
  })

  useSeo(() => ({
    title: title.value || site.listing.projectsTitle,
    description: project.value?.summary,
    image: project.value?.images[0]?.url,
    jsonLd: project.value
      ? projectSchema(
          project.value,
          title.value,
          catalog.sectorLabel(project.value.sector),
          `${window.location.origin}${window.location.pathname}`,
        )
      : null,
  }))

  return { slug, detail, related, project, units, title, whatsappHref }
}
