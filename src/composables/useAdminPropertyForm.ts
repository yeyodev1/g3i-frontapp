import { computed } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAdminEditor, type FormErrors } from './useAdminEditor'
import type { PropertyForm } from '@/types/admin'

export const MAX_PHOTOS = 25
export const MIN_PHOTOS = 5

export function emptyProperty(): PropertyForm {
  return {
    code: '',
    title: '',
    summary: '',
    description: '',
    type: 'casa',
    transaction: 'venta',
    condition: 'usada',
    ageYears: null,
    sector: '',
    city: 'Quito',
    address: '',
    locality: '',
    badge: '',
    location: { lat: null, lng: null, exact: false, radiusMeters: 400 },
    price: 0,
    hoa: { enabled: false, amount: 0 },
    totalM2: null,
    builtM2: null,
    gardenM2: null,
    bedrooms: null,
    bathrooms: null,
    halfBathrooms: null,
    parking: null,
    storageRooms: null,
    elevators: null,
    floors: null,
    serviceBathroom: false,
    frontMeters: null,
    depthMeters: null,
    buildableFloors: null,
    landUse: '',
    amenities: [],
    images: [],
    videos: [],
    floorPlans: [],
    status: 'draft',
    isFeatured: false,
    featuredOrder: 0,
    project: null,
  }
}

function validate(form: PropertyForm): FormErrors {
  const errors: FormErrors = {}
  if (form.title.trim().length < 5) errors.title = 'Escribe un título de al menos 5 letras.'
  if (!form.type) errors.type = 'Elige el tipo de inmueble.'
  if (!form.sector) errors.sector = 'Elige el sector.'
  if (form.summary.length > 220) errors.summary = 'El resumen es muy largo: máximo 220 caracteres.'
  if (form.code && !/^[A-Za-z0-9-]+$/.test(form.code)) {
    errors.code = 'Usa solo letras, números y guiones.'
  }
  if (form.status !== 'draft' && !(form.price > 0)) {
    errors.price = 'Para publicarla necesita un precio.'
  }
  if (form.hoa.enabled && !(form.hoa.amount > 0)) errors.hoa = 'Escribe el valor de la alícuota.'
  if (form.images.length > MAX_PHOTOS) errors.images = `Máximo ${MAX_PHOTOS} fotos.`
  return errors
}

// Un terreno no tiene dormitorios ni ascensores: se limpian para que no
// aparezcan íconos sueltos en el sitio si antes era otro tipo.
function beforeSave(form: PropertyForm): PropertyForm {
  if (form.type === 'terreno') {
    form.bedrooms = null
    form.bathrooms = null
    form.halfBathrooms = null
    form.parking = null
    form.elevators = null
    form.storageRooms = null
    form.floors = null
    form.builtM2 = null
    form.serviceBathroom = false
  } else {
    form.frontMeters = null
    form.depthMeters = null
    form.buildableFloors = null
    form.landUse = ''
  }
  if (!form.hoa.enabled) form.hoa.amount = 0
  form.code = form.code.trim().toUpperCase()
  form.title = form.title.trim()
  return form
}

export function useAdminPropertyForm() {
  const editor = useAdminEditor({
    empty: emptyProperty,
    fetch: (id) => adminService.getProperty(id),
    save: (form) => adminService.saveProperty(form),
    validate,
    beforeSave,
    editRoute: (id) => ({ name: 'AdminPropertyEdit', params: { id } }),
  })

  const isLand = computed(() => editor.form.value.type === 'terreno')

  return { ...editor, isLand }
}
