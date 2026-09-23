import { onUnmounted, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { site } from '@/config/site'

interface SeoInput {
  title?: string
  description?: string
  image?: string
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function absolute(url: string): string {
  if (!url) return `${site.url}${site.logo}`
  return /^https?:/i.test(url) ? url : `${window.location.origin}${url}`
}

/**
 * Título, descripción y Open Graph por vista. Acepta un getter para que las
 * fichas lo actualicen cuando llegan los datos. Corre después del afterEach
 * del router, así que su título manda sobre el genérico de meta.title.
 */
export function useSeo(input: MaybeRefOrGetter<SeoInput>) {
  const stop = watchEffect(() => {
    const seo = toValue(input)
    const title = seo.title && seo.title !== site.name ? `${seo.title} — ${site.name}` : site.name
    const description = seo.description || site.description
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', window.location.href)
    setMeta('property', 'og:image', absolute(seo.image || ''))
  })

  onUnmounted(stop)
}
