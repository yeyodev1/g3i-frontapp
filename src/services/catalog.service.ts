import APIBase from './httpBase'
import type { Catalogs, SectorCount } from '@/types'

class CatalogService extends APIBase {
  async getCatalogs(): Promise<Catalogs> {
    const { data } = await this.get<Catalogs>('catalogs')
    return data
  }

  /** Con active=true solo vienen sectores con al menos un inmueble publicado. */
  async getSectors(active = true): Promise<SectorCount[]> {
    const { data } = await this.get<SectorCount[]>(`sectors${active ? '?active=true' : ''}`)
    return data
  }
}

export const catalogService = new CatalogService()
