import { computed, onMounted, ref, shallowRef } from 'vue'
import { propertyService } from '@/services/property.service'
import { projectService } from '@/services/project.service'
import { postService } from '@/services/post.service'
import { useCatalogStore } from '@/stores/catalog'
import type { PostCard, ProjectCard, PropertyCard } from '@/types'

/**
 * Datos de la home. Cada bloque carga por su cuenta: si el blog falla, las
 * propiedades igual se muestran. Destacados con respaldo a los más recientes.
 */
export function useHomeData() {
  const catalog = useCatalogStore()
  const properties = shallowRef<PropertyCard[]>([])
  const projects = shallowRef<ProjectCard[]>([])
  const posts = shallowRef<PostCard[]>([])
  const loadingProperties = ref(true)
  const loadingProjects = ref(true)
  const propertiesError = ref(false)

  async function loadProperties() {
    loadingProperties.value = true
    propertiesError.value = false
    try {
      // «Las más buscadas»: primero las que la inmobiliaria destaca, en su orden,
      // y luego las más visitadas (el backend resuelve el orden).
      let res = await propertyService.list({ sort: 'popular', limit: 6 })
      if (!res.items.length) res = await propertyService.list({ limit: 6, sort: 'recent' })
      properties.value = res.items
    } catch {
      propertiesError.value = true
    } finally {
      loadingProperties.value = false
    }
  }

  async function loadProjects() {
    loadingProjects.value = true
    try {
      let res = await projectService.list({ featured: true, limit: 3 })
      if (!res.items.length) res = await projectService.list({ limit: 3 })
      projects.value = res.items
    } catch {
      projects.value = []
    } finally {
      loadingProjects.value = false
    }
  }

  async function loadPosts() {
    try {
      posts.value = (await postService.list(1, 3)).items
    } catch {
      posts.value = []
    }
  }

  const settings = computed(() => catalog.site?.settings ?? null)
  // Foto de portada del panel; si aún no hay, la primera propiedad sirve de respaldo.
  const heroImage = computed(
    () => settings.value?.hero.image?.url || properties.value[0]?.cover || '',
  )

  onMounted(() => {
    catalog.ensureSite()
    catalog.ensureBasics()
    loadProperties()
    loadProjects()
    loadPosts()
  })

  return {
    catalog,
    settings,
    heroImage,
    properties,
    projects,
    posts,
    loadingProperties,
    loadingProjects,
    propertiesError,
    loadProperties,
  }
}
