import APIBase from './httpBase'
import { toQuery } from '@/utils/query'
import type { Paginated, Property, PropertyCard, PropertyFilters } from '@/types'

class PropertyService extends APIBase {
  async list(filters: PropertyFilters = {}): Promise<Paginated<PropertyCard>> {
    const { data } = await this.get<Paginated<PropertyCard>>(`properties${toQuery(filters)}`)
    return data
  }

  async getBySlug(slug: string): Promise<Property> {
    const { data } = await this.get<Property>(`properties/${encodeURIComponent(slug)}`)
    return data
  }

  async related(slug: string): Promise<PropertyCard[]> {
    const { data } = await this.get<PropertyCard[]>(`properties/${encodeURIComponent(slug)}/related`)
    return data
  }
}

export const propertyService = new PropertyService()
