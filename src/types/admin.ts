import type {
  Advisor,
  Faq,
  Image,
  Lead,
  Partner,
  Post,
  Project,
  ProjectCard,
  Property,
  PropertyCard,
  Testimonial,
  Unit,
} from './index'

/** Campos que genera el backend y nunca se envían desde el formulario. */
type ServerFields = '_id' | 'slug' | 'views' | 'createdAt' | 'updatedAt'

export type PropertyForm = Omit<Property, ServerFields> & { _id?: string; slug?: string }
export type ProjectForm = Omit<Project, ServerFields | 'status'> & {
  _id?: string
  slug?: string
  status: Project['status']
}
export type UnitForm = Omit<Unit, '_id' | 'project'> & { _id?: string }
export type PostForm = Omit<Post, '_id' | 'slug' | 'publishedAt'> & { _id?: string; slug?: string }

export type FaqForm = Omit<Faq, '_id'> & { _id?: string }
export type AdvisorForm = Omit<Advisor, '_id'> & { _id?: string }
export type TestimonialForm = Omit<Testimonial, '_id'> & { _id?: string }
export type PartnerForm = Omit<Partner, '_id'> & { _id?: string }

/** Fila del listado admin: la tarjeta pública más estado y fechas. */
export interface AdminPropertyRow extends PropertyCard {
  status: Property['status']
  views: number
  featuredOrder?: number
  createdAt?: string
  updatedAt?: string
}

export interface AdminProjectRow extends ProjectCard {
  status: Project['status']
  unitsTotal: number
  views: number
  isFeatured: boolean
  featuredOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface AdminListQuery {
  q?: string
  /** 'views' ordena por visitas (lo más buscado). */
  sort?: string
  status?: string
  type?: string
  kind?: string
  page?: number
  limit?: number
}

/** Un lead puede traer el inmueble poblado o solo su id. */
export interface LeadRef {
  _id: string
  title?: string
  name?: string
  slug?: string
  code?: string
}

export interface AdminLead extends Omit<Lead, 'property' | 'project' | 'unit'> {
  property?: string | LeadRef | null
  project?: string | LeadRef | null
  unit?: string | LeadRef | null
}

export type UploadKind = 'image' | 'video' | 'raw'
export type UploadFolder =
  | 'properties'
  | 'projects'
  | 'posts'
  | 'team'
  | 'testimonials'
  | 'partners'
  | 'site'
  | 'brochures'

/** Recursos que se manejan con la misma lista + modal. */
export type SimpleResource = 'faqs' | 'advisors' | 'testimonials' | 'partners'

export interface Orderable {
  _id: string
  order: number
}

export type MaybeImage = Image | null
