import axios from 'axios'
import APIBase from './httpBase'
import type {
  ApiError,
  Catalogs,
  Dashboard,
  Paginated,
  Project,
  Property,
  Settings,
  Unit,
  UploadResult,
} from '@/types'
import type {
  AdminLead,
  AdminListQuery,
  DirectUploadTicket,
  AdminProjectRow,
  AdminPropertyRow,
  ProjectForm,
  PropertyForm,
  UnitForm,
  UploadFolder,
  UploadKind,
} from '@/types/admin'

// Diez minutos: un video de 100 MB por una conexión móvil tarda. httpBase
// reemplaza un timeout 0 por 15 s, así que se pasa un número explícito.
const UPLOAD_TIMEOUT = 10 * 60 * 1000

/** Cloudinary responde { error: { message } } en inglés; se adapta al ApiError de la casa. */
function toUploadError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response) {
    const detail = (error.response.data as { error?: { message?: string } })?.error?.message
    return { status: error.response.status, message: detail || 'Cloudinary rechazó el archivo' }
  }
  if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
    return { status: 408, message: 'La subida tardó demasiado, revisa tu conexión' }
  }
  return { status: 500, message: 'No se pudo conectar con Cloudinary' }
}

export function toQuery(params: object = {}): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
  })
  const text = search.toString()
  return text ? `?${text}` : ''
}

/** El API responde con cuerpo desnudo, pero se toleran `{ key: ... }` por si acaso. */
export function unwrap<T>(data: unknown, key: string): T {
  if (data && typeof data === 'object' && key in data) {
    return (data as Record<string, T>)[key] as T
  }
  return data as T
}

/** Listas que pueden venir como arreglo o paginadas. */
export function toPage<T>(data: unknown, key = 'items'): Paginated<T> {
  if (Array.isArray(data)) return { items: data, total: data.length, page: 1, pages: 1 }
  const obj = (data ?? {}) as Partial<Paginated<T>> & Record<string, unknown>
  const items = (obj.items ?? (obj[key] as T[]) ?? []) as T[]
  return { items, total: obj.total ?? items.length, page: obj.page ?? 1, pages: obj.pages ?? 1 }
}

class AdminService extends APIBase {
  async catalogs(): Promise<Catalogs> {
    const { data } = await this.get<Catalogs>('catalogs')
    return data
  }

  async dashboard(): Promise<Dashboard> {
    const { data } = await this.get<Dashboard>('admin/dashboard')
    return data
  }

  // ─── Propiedades y proyectos (misma forma de rutas) ──────────────────

  async listProperties(query: AdminListQuery): Promise<Paginated<AdminPropertyRow>> {
    const { data } = await this.get<unknown>(`admin/properties${toQuery(query)}`)
    return toPage<AdminPropertyRow>(data, 'properties')
  }

  async getProperty(id: string): Promise<Property> {
    const { data } = await this.get<unknown>(`admin/properties/${id}`)
    return unwrap<Property>(data, 'property')
  }

  async saveProperty(form: PropertyForm): Promise<Property> {
    const { _id, ...body } = form
    const { data } = _id
      ? await this.put<unknown>(`admin/properties/${_id}`, body)
      : await this.post<unknown>('admin/properties', body)
    return unwrap<Property>(data, 'property')
  }

  async setPropertyStatus(id: string, status: Property['status']): Promise<Property> {
    const { data } = await this.patch<unknown>(`admin/properties/${id}/status`, { status })
    return unwrap<Property>(data, 'property')
  }

  async setPropertyFeatured(id: string, isFeatured: boolean, featuredOrder = 0): Promise<Property> {
    const body = { isFeatured, featuredOrder }
    const { data } = await this.patch<unknown>(`admin/properties/${id}/featured`, body)
    return unwrap<Property>(data, 'property')
  }

  async deleteProperty(id: string): Promise<void> {
    await this.delete(`admin/properties/${id}`)
  }

  async listProjects(query: AdminListQuery): Promise<Paginated<AdminProjectRow>> {
    const { data } = await this.get<unknown>(`admin/projects${toQuery(query)}`)
    return toPage<AdminProjectRow>(data, 'projects')
  }

  async getProject(id: string): Promise<Project> {
    const { data } = await this.get<unknown>(`admin/projects/${id}`)
    return unwrap<Project>(data, 'project')
  }

  async saveProject(form: ProjectForm): Promise<Project> {
    const { _id, ...body } = form
    const { data } = _id
      ? await this.put<unknown>(`admin/projects/${_id}`, body)
      : await this.post<unknown>('admin/projects', body)
    return unwrap<Project>(data, 'project')
  }

  async setProjectStatus(id: string, status: Project['status']): Promise<Project> {
    const { data } = await this.patch<unknown>(`admin/projects/${id}/status`, { status })
    return unwrap<Project>(data, 'project')
  }

  async setProjectFeatured(id: string, isFeatured: boolean, featuredOrder = 0): Promise<Project> {
    const body = { isFeatured, featuredOrder }
    const { data } = await this.patch<unknown>(`admin/projects/${id}/featured`, body)
    return unwrap<Project>(data, 'project')
  }

  async deleteProject(id: string): Promise<void> {
    await this.delete(`admin/projects/${id}`)
  }

  // ─── Unidades ────────────────────────────────────────────────────────

  async listUnits(projectId: string): Promise<Unit[]> {
    const { data } = await this.get<unknown>(`admin/projects/${projectId}/units`)
    return toPage<Unit>(data, 'units').items
  }

  async saveUnit(projectId: string, form: UnitForm): Promise<Unit> {
    const { _id, ...body } = form
    const { data } = _id
      ? await this.put<unknown>(`admin/units/${_id}`, body)
      : await this.post<unknown>(`admin/projects/${projectId}/units`, body)
    return unwrap<Unit>(data, 'unit')
  }

  async setUnitStatus(id: string, status: Unit['status']): Promise<Unit> {
    const { data } = await this.patch<unknown>(`admin/units/${id}/status`, { status })
    return unwrap<Unit>(data, 'unit')
  }

  async deleteUnit(id: string): Promise<void> {
    await this.delete(`admin/units/${id}`)
  }

  // ─── Formularios ─────────────────────────────────────────────────────

  async listLeads(query: AdminListQuery): Promise<Paginated<AdminLead>> {
    const { data } = await this.get<unknown>(`admin/leads${toQuery(query)}`)
    return toPage<AdminLead>(data, 'leads')
  }

  async setLeadStatus(id: string, status: AdminLead['status']): Promise<AdminLead> {
    const { data } = await this.patch<unknown>(`admin/leads/${id}`, { status })
    return unwrap<AdminLead>(data, 'lead')
  }

  async retryLeadCrm(id: string): Promise<AdminLead> {
    const { data } = await this.post<unknown>(`admin/leads/${id}/crm-retry`, {})
    return unwrap<AdminLead>(data, 'lead')
  }

  async deleteLead(id: string): Promise<void> {
    await this.delete(`admin/leads/${id}`)
  }

  // ─── Ajustes ─────────────────────────────────────────────────────────

  async getSettings(): Promise<Settings> {
    const { data } = await this.get<unknown>('admin/settings')
    return unwrap<Settings>(data, 'settings')
  }

  async saveSettings(settings: Settings): Promise<Settings> {
    const { data } = await this.put<unknown>('admin/settings', settings)
    return unwrap<Settings>(data, 'settings')
  }

  // ─── Archivos ────────────────────────────────────────────────────────

  /**
   * El API solo firma la subida; el archivo va del navegador directo a
   * Cloudinary. Pasarlo por el backend (Vercel) corta todo cuerpo > 4.5 MB
   * con un 413 sin CORS que el navegador reporta como fallo de conexión.
   */
  async upload(
    file: File,
    folder: UploadFolder,
    kind: UploadKind,
    onProgress?: (ratio: number) => void,
  ): Promise<UploadResult> {
    const { data: ticket } = await this.post<DirectUploadTicket>('admin/uploads/signature', {
      folder,
      kind,
    })
    const form = new FormData()
    Object.entries(ticket.fields).forEach(([key, value]) => form.append(key, value))
    form.append('file', file)
    try {
      const { data } = await axios.post<{ secure_url: string; public_id: string }>(
        ticket.uploadUrl,
        form,
        {
          timeout: UPLOAD_TIMEOUT,
          onUploadProgress: (event) => {
            if (onProgress && event.total) onProgress(event.loaded / event.total)
          },
        },
      )
      return { url: data.secure_url, publicId: data.public_id, resourceType: ticket.resourceType }
    } catch (error) {
      throw toUploadError(error)
    }
  }
}

export const adminService = new AdminService()
