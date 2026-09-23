import APIBase from './httpBase'
import { toQuery } from '@/utils/query'
import type { Paginated, Project, ProjectCard, ProjectFilters, Unit } from '@/types'

class ProjectService extends APIBase {
  async list(filters: ProjectFilters = {}): Promise<Paginated<ProjectCard>> {
    const { data } = await this.get<Paginated<ProjectCard>>(`projects${toQuery(filters)}`)
    return data
  }

  async getBySlug(slug: string): Promise<{ project: Project; units: Unit[] }> {
    const { data } = await this.get<{ project: Project; units: Unit[] }>(
      `projects/${encodeURIComponent(slug)}`,
    )
    return data
  }

  async related(slug: string): Promise<ProjectCard[]> {
    const { data } = await this.get<ProjectCard[]>(`projects/${encodeURIComponent(slug)}/related`)
    return data
  }

  async getUnit(slug: string, unitId: string): Promise<{ project: ProjectCard; unit: Unit }> {
    const { data } = await this.get<{ project: ProjectCard; unit: Unit }>(
      `projects/${encodeURIComponent(slug)}/units/${encodeURIComponent(unitId)}`,
    )
    return data
  }
}

export const projectService = new ProjectService()
