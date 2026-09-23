import { defineStore } from 'pinia'
import { catalogService } from '@/services/catalog.service'
import { siteService } from '@/services/site.service'
import { site } from '@/config/site'
import type { Amenity, Catalogs, SectorCount, SiteData } from '@/types'

// Respaldo mientras el API no responde: la web nunca queda sin etiquetas.
const FALLBACK_TYPES: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  terreno: 'Terreno',
  suite: 'Suite',
  local: 'Local comercial',
  oficina: 'Oficina',
}

function prettify(key: string): string {
  if (!key) return ''
  const text = key.replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Promesas en vuelo compartidas: varias vistas piden lo mismo al arrancar.
let catalogsPromise: Promise<void> | null = null
let sectorsPromise: Promise<void> | null = null
let sitePromise: Promise<void> | null = null

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    catalogs: null as Catalogs | null,
    activeSectors: [] as SectorCount[],
    site: null as SiteData | null,
    siteError: false,
  }),

  getters: {
    propertyTypes: (s) =>
      s.catalogs?.propertyTypes ??
      Object.entries(FALLBACK_TYPES).map(([key, label]) => ({ key, label })),
    conditions: (s) => s.catalogs?.conditions ?? [],
    projectStages: (s) => s.catalogs?.projectStages ?? [],
    allSectors: (s) => s.catalogs?.sectors ?? [],

    typeLabel: (s) => (key: string) =>
      s.catalogs?.propertyTypes.find((t) => t.key === key)?.label ?? FALLBACK_TYPES[key] ?? prettify(key),
    sectorLabel: (s) => (key: string) =>
      s.catalogs?.sectors.find((t) => t.key === key)?.label ??
      s.activeSectors.find((t) => t.key === key)?.label ??
      prettify(key),
    conditionLabel: (s) => (key: string) =>
      s.catalogs?.conditions.find((t) => t.key === key)?.label ?? prettify(key),
    stageLabel: (s) => (key: string) =>
      s.catalogs?.projectStages.find((t) => t.key === key)?.label ?? prettify(key),
    amenity: (s) => (key: string): Amenity =>
      s.catalogs?.amenities.find((a) => a.key === key) ?? {
        key,
        label: prettify(key),
        icon: 'fa-solid fa-check',
        scope: 'both',
      },

    /** Contacto de /api/site con respaldo en site.ts, campo por campo. */
    contact: (s) => {
      const c = s.site?.settings.contact
      return {
        whatsapp: c?.whatsapp || site.whatsapp,
        phone: c?.phone || site.phone,
        email: c?.email || site.email,
        instagram: c?.instagram || site.social.instagram,
        facebook: c?.facebook || site.social.facebook,
        address: c?.address || '',
      }
    },
  },

  actions: {
    ensureCatalogs(): Promise<void> {
      if (this.catalogs) return Promise.resolve()
      catalogsPromise ??= catalogService
        .getCatalogs()
        .then((data) => {
          this.catalogs = data
        })
        .catch(() => {
          catalogsPromise = null
        })
      return catalogsPromise
    },

    ensureActiveSectors(): Promise<void> {
      if (this.activeSectors.length) return Promise.resolve()
      sectorsPromise ??= catalogService
        .getSectors(true)
        .then((data) => {
          this.activeSectors = data
        })
        .catch(() => {
          sectorsPromise = null
        })
      return sectorsPromise
    },

    ensureSite(): Promise<void> {
      if (this.site) return Promise.resolve()
      sitePromise ??= siteService
        .getSite()
        .then((data) => {
          this.site = data
          this.siteError = false
        })
        .catch(() => {
          this.siteError = true
          sitePromise = null
        })
      return sitePromise
    },

    /** Lo que casi toda vista pública necesita para pintar etiquetas y filtros. */
    ensureBasics(): Promise<unknown> {
      return Promise.all([this.ensureCatalogs(), this.ensureActiveSectors()])
    },
  },
})
