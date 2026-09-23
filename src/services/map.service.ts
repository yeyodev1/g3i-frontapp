import APIBase from './httpBase'
import { toQuery } from '@/utils/query'
import type { MapPin } from '@/types'

export interface MapFilters {
  type?: string
  sector?: string
  condition?: string
  stage?: string
}

class MapService extends APIBase {
  async getPins(filters: MapFilters = {}): Promise<{ properties: MapPin[]; projects: MapPin[] }> {
    const { data } = await this.get<{ properties: MapPin[]; projects: MapPin[] }>(
      `map${toQuery(filters)}`,
    )
    return data
  }
}

export const mapService = new MapService()
