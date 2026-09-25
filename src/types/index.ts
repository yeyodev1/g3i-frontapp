/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Catálogos ──────────────────────────────────────────────────────────

export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'suite' | 'local' | 'oficina'
export type PropertyCondition = 'en-planos' | 'en-construccion' | 'a-estrenar' | 'usada'
export type ProjectStage = 'en-planos' | 'en-construccion' | 'por-estrenar'

export interface CatalogItem<K extends string = string> {
  key: K
  label: string
}

export interface Amenity extends CatalogItem {
  icon: string
  scope: 'property' | 'project' | 'both'
}

export interface Catalogs {
  propertyTypes: CatalogItem<PropertyType>[]
  conditions: CatalogItem<PropertyCondition>[]
  projectStages: CatalogItem<ProjectStage>[]
  sectors: CatalogItem[]
  amenities: Amenity[]
}

export interface SectorCount extends CatalogItem {
  count: number
}

// ─── Piezas comunes ─────────────────────────────────────────────────────

export interface Image {
  url: string
  publicId: string
  alt?: string
}

export interface Video {
  url: string
  publicId: string
}

export interface GeoLocation {
  lat: number | null
  lng: number | null
  exact: boolean
  radiusMeters: number
}

// ─── Propiedades ────────────────────────────────────────────────────────

export type PropertyStatus = 'draft' | 'published' | 'sold' | 'hidden'

export interface Property {
  _id: string
  code: string
  title: string
  slug: string
  summary: string
  description: string
  type: PropertyType
  transaction: 'venta'
  condition: PropertyCondition
  ageYears: number | null
  sector: string
  city: string
  address: string
  locality: string
  badge: string
  location: GeoLocation
  price: number
  hoa: { enabled: boolean; amount: number }
  totalM2: number | null
  builtM2: number | null
  gardenM2: number | null
  bedrooms: number | null
  bathrooms: number | null
  halfBathrooms: number | null
  parking: number | null
  storageRooms: number | null
  elevators: number | null
  floors: number | null
  serviceBathroom: boolean
  frontMeters: number | null
  depthMeters: number | null
  /** Solo terrenos: uso del suelo (lista editable en Configuración). */
  landUse: string
  buildableFloors: number | null
  amenities: string[]
  images: Image[]
  videos: Video[]
  floorPlans: Image[]
  status: PropertyStatus
  isFeatured: boolean
  featuredOrder: number
  project: string | null
  views: number
  createdAt?: string
  updatedAt?: string
}

export interface PropertyCard {
  _id: string
  code: string
  title: string
  slug: string
  summary: string
  type: PropertyType
  condition: PropertyCondition
  sector: string
  /** Subzona: barrio, urbanización o proyecto ("Kentia"). */
  locality: string
  /** Etiqueta corta sobre la foto ("Destacada"). */
  badge: string
  price: number
  cover: string
  imagesCount: number
  bedrooms: number | null
  bathrooms: number | null
  parking: number | null
  builtM2: number | null
  totalM2: number | null
  frontMeters: number | null
  landUse: string
  isFeatured: boolean
}

export interface PropertyFilters {
  type?: string
  sector?: string
  condition?: string
  minPrice?: string | number
  maxPrice?: string | number
  bedrooms?: string | number
  landUse?: string
  minM2?: string | number
  maxM2?: string | number
  q?: string
  featured?: boolean
  page?: number
  limit?: number
  sort?: 'recent' | 'price-asc' | 'price-desc' | 'popular'
}

// ─── Proyectos ──────────────────────────────────────────────────────────

export type ProjectStatus = 'draft' | 'published' | 'sold-out' | 'hidden'

export interface Project {
  _id: string
  code: string
  title: string
  slug: string
  summary: string
  description: string
  stage: ProjectStage
  propertyTypes: PropertyType[]
  developer: string
  sector: string
  city: string
  address: string
  locality: string
  location: GeoLocation
  priceFrom: number | null
  deliveryDate: string
  totalUnits: number | null
  amenities: string[]
  highlights: string[]
  images: Image[]
  videos: Video[]
  brochure: { url: string; publicId: string; name: string } | null
  status: ProjectStatus
  isFeatured: boolean
  featuredOrder: number
  views: number
  createdAt?: string
  updatedAt?: string
}

export interface ProjectCard {
  _id: string
  code: string
  title: string
  slug: string
  summary: string
  stage: ProjectStage
  propertyTypes: PropertyType[]
  sector: string
  locality: string
  priceFrom: number | null
  deliveryDate: string
  cover: string
  unitsAvailable: number
}

export type UnitStatus = 'available' | 'reserved' | 'sold'

export interface Unit {
  _id: string
  project: string
  name: string
  type: PropertyType
  floor: string
  bedrooms: number | null
  bathrooms: number | null
  parking: number | null
  storageRooms: number | null
  builtM2: number | null
  balconyM2: number | null
  terraceM2: number | null
  gardenM2: number | null
  price: number
  description: string
  floorPlan: Image | null
  images: Image[]
  status: UnitStatus
  order: number
}

export interface ProjectFilters {
  stage?: string
  sector?: string
  type?: string
  featured?: boolean
  q?: string
  page?: number
  limit?: number
}

// ─── Mapa ───────────────────────────────────────────────────────────────

export interface MapPin {
  id: string
  kind: 'property' | 'project'
  slug: string
  title: string
  type: PropertyType | string
  price: number | null
  sector: string
  cover: string
  lat: number
  lng: number
  exact: boolean
  radiusMeters: number
  bedrooms: number | null
  builtM2: number | null
  totalM2: number | null
  landUse: string
}

// ─── Contenido ──────────────────────────────────────────────────────────

export interface PostCard {
  _id: string
  title: string
  slug: string
  excerpt: string
  cover: Image | null
}

export interface Post extends PostCard {
  content: string
  status: 'draft' | 'published'
  publishedAt: string | null
}

export interface Faq {
  _id: string
  question: string
  answer: string
  order: number
  isPublished: boolean
}

export interface Advisor {
  _id: string
  name: string
  role: string
  photo: Image | null
  bio: string
  phone: string
  email: string
  order: number
  isActive: boolean
}

export interface Testimonial {
  _id: string
  name: string
  text: string
  photo: Image | null
  rating: number
  context: string
  order: number
  isActive: boolean
}

export interface Partner {
  _id: string
  name: string
  logo: Image | null
  url: string
  order: number
  isActive: boolean
}

export interface PopularSearch {
  label: string
  query: Record<string, string>
}

/** Cifra de la banda de Inicio. icon es una clave de STAT_ICONS (config/copy.home.ts). */
export interface HomeStat {
  icon: string
  label: string
  value: string
}

/** Rango del filtro de precio en USD. null = sin límite por ese lado. */
export interface PriceRange {
  min: number | null
  max: number | null
}

export interface Settings {
  hero: { title: string; subtitle: string; image: Image | null; ctaLabel: string; ctaLink: string }
  popularSearches: PopularSearch[]
  about: { title: string; text: string; image: Image | null }
  stats: HomeStat[]
  landUses: string[]
  priceRanges: PriceRange[]
  contact: {
    whatsapp: string
    phone: string
    email: string
    instagram: string
    facebook: string
    address: string
  }
  sellCta: { title: string; text: string }
}

export interface SiteData {
  settings: Settings
  advisors: Advisor[]
  testimonials: Testimonial[]
  partners: Partner[]
  counts: {
    properties: number
    projects: number
    sectors: number
    byType?: Record<string, number>
    prices?: number[]
  }
}

// ─── Leads ──────────────────────────────────────────────────────────────

export type LeadKind =
  'property' | 'project' | 'unit' | 'sell' | 'general' | 'work-with-us' | 'interested'

export interface LeadInput {
  kind: LeadKind
  name: string
  email?: string
  phone: string
  message?: string
  sellSector?: string
  sellPropertyType?: string
  property?: string
  project?: string
  unit?: string
  refCode?: string
  sourceUrl?: string
  /** Honeypot: siempre vacío en humanos. */
  website?: string
}

export interface Lead extends LeadInput {
  _id: string
  status: 'new' | 'contacted' | 'closed'
  crm: {
    status: 'pending' | 'sent' | 'failed' | 'skipped'
    error: string
    externalId: string
    sentAt: string | null
  }
  createdAt: string
}

export interface Dashboard {
  properties: Record<PropertyStatus, number>
  projects: Record<ProjectStatus, number>
  units: Record<UnitStatus, number>
  leads: { new: number; total: number; last7d: number }
  recentLeads: Lead[]
}

export interface UploadResult {
  url: string
  publicId: string
  resourceType: 'image' | 'video' | 'raw'
}
