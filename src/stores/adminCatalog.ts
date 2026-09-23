import { defineStore } from 'pinia'
import { adminService } from '@/services/admin.service'
import type { Amenity, Catalogs, CatalogItem } from '@/types'

type Scope = 'property' | 'project'

/** Catálogos para los selects del portal. Se piden una vez por sesión. */
export const useAdminCatalogStore = defineStore('adminCatalog', {
  state: () => ({
    catalogs: null as Catalogs | null,
    loading: false,
    promise: null as Promise<void> | null,
  }),

  getters: {
    propertyTypes: (s): CatalogItem[] => s.catalogs?.propertyTypes ?? [],
    conditions: (s): CatalogItem[] => s.catalogs?.conditions ?? [],
    projectStages: (s): CatalogItem[] => s.catalogs?.projectStages ?? [],
    sectors: (s): CatalogItem[] => s.catalogs?.sectors ?? [],
    amenities: (s): Amenity[] => s.catalogs?.amenities ?? [],
  },

  actions: {
    load(): Promise<void> {
      if (this.catalogs) return Promise.resolve()
      if (this.promise) return this.promise
      this.loading = true
      this.promise = adminService
        .catalogs()
        .then((data) => {
          this.catalogs = data
        })
        .catch(() => {
          // Sin catálogos los selects quedan vacíos; se reintenta en la próxima vista.
          this.promise = null
        })
        .finally(() => {
          this.loading = false
        })
      return this.promise
    },

    amenitiesFor(scope: Scope): Amenity[] {
      return this.amenities.filter((a) => a.scope === scope || a.scope === 'both')
    },

    label(list: 'propertyTypes' | 'conditions' | 'projectStages' | 'sectors', key: string): string {
      const items = (this.catalogs?.[list] ?? []) as CatalogItem[]
      return items.find((item) => item.key === key)?.label ?? key
    },
  },
})
