import { adminService } from '@/services/admin.service'
import { useAdminEditor, type FormErrors } from './useAdminEditor'
import type { ProjectForm } from '@/types/admin'

export function emptyProject(): ProjectForm {
  return {
    code: '',
    title: '',
    summary: '',
    description: '',
    stage: 'en-planos',
    propertyTypes: [],
    developer: '',
    sector: '',
    city: 'Quito',
    address: '',
    locality: '',
    location: { lat: null, lng: null, exact: false, radiusMeters: 400 },
    priceFrom: null,
    deliveryDate: '',
    totalUnits: null,
    amenities: [],
    highlights: [],
    images: [],
    videos: [],
    brochure: null,
    status: 'draft',
    isFeatured: false,
    featuredOrder: 0,
  }
}

function validate(form: ProjectForm): FormErrors {
  const errors: FormErrors = {}
  if (form.title.trim().length < 3) errors.title = 'Escribe el nombre del proyecto.'
  if (!form.sector) errors.sector = 'Elige el sector.'
  if (!form.stage) errors.stage = 'Elige la etapa del proyecto.'
  if (!form.propertyTypes.length) errors.propertyTypes = 'Marca al menos un tipo de inmueble.'
  if (form.summary.length > 220) errors.summary = 'El resumen es muy largo: máximo 220 caracteres.'
  if (form.code && !/^[A-Za-z0-9-]+$/.test(form.code)) {
    errors.code = 'Usa solo letras, números y guiones.'
  }
  if (form.images.length > 25) errors.images = 'Máximo 25 renders.'
  return errors
}

function beforeSave(form: ProjectForm): ProjectForm {
  form.code = form.code.trim().toUpperCase()
  form.title = form.title.trim()
  form.highlights = form.highlights.map((h) => h.trim()).filter(Boolean)
  return form
}

export function useAdminProjectForm() {
  return useAdminEditor({
    empty: emptyProject,
    fetch: (id) => adminService.getProject(id),
    save: (form) => adminService.saveProject(form),
    validate,
    beforeSave,
    editRoute: (id) => ({ name: 'AdminProjectEdit', params: { id } }),
  })
}
