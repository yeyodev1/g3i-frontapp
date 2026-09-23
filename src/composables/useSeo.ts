import { onUnmounted, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { site } from '@/config/site'

interface SeoInput {
  title?: string
  description?: string
  image?: string
  /** Datos estructurados (schema.org) de la página: propiedad, proyecto, artículo… */
  jsonLd?: Record<string, unknown> | null
}

const JSON_LD_ID = 'seo-jsonld'

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data: Record<string, unknown> | null | undefined) {
  document.getElementById(JSON_LD_ID)?.remove()
  if (!data) return
  const el = document.createElement('script')
  el.type = 'application/ld+json'
  el.id = JSON_LD_ID
  el.textContent = JSON.stringify({ '@context': 'https://schema.org', ...data })
  document.head.appendChild(el)
}

function absolute(url: string): string {
  if (!url) return `${window.location.origin}${site.logo}`
  return /^https?:/i.test(url) ? url : `${window.location.origin}${url}`
}

/**
 * Mientras el WordPress siga en g3i.ec, la versión de vista previa (vercel.app, túneles)
 * no debe indexarse: competiría con el sitio actual como contenido duplicado.
 * Al apuntar el dominio a este sitio, deja de aplicar sola.
 */
const isPreviewHost = /\.vercel\.app$|trycloudflare\.com$|^localhost$|^127\./.test(window.location.hostname)

/**
 * Título, descripción, canonical, Open Graph y JSON-LD por vista. Acepta un getter
 * para que las fichas lo actualicen cuando llegan los datos. Corre después del
 * afterEach del router, así que su título manda sobre el genérico de meta.title.
 */
export function useSeo(input: MaybeRefOrGetter<SeoInput>) {
  const stop = watchEffect(() => {
    const seo = toValue(input)
    const title = seo.title && seo.title !== site.name ? `${seo.title} — ${site.name}` : site.name
    const description = seo.description || site.description
    // Sin query ni hash: /propiedades?type=casa y /propiedades son la misma página para Google.
    const canonical = `${window.location.origin}${window.location.pathname}`

    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', isPreviewHost ? 'noindex, nofollow' : 'index, follow')
    setCanonical(canonical)
    setMeta('property', 'og:type', seo.jsonLd ? 'article' : 'website')
    setMeta('property', 'og:locale', 'es_EC')
    setMeta('property', 'og:site_name', site.name)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', absolute(seo.image || ''))
    setJsonLd(seo.jsonLd)
  })

  onUnmounted(() => {
    stop()
    setJsonLd(null)
  })
}
