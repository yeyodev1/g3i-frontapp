import { site } from '@/config/site'
import type { Post, Project, Property, Unit } from '@/types'

/**
 * Datos estructurados (schema.org) para que Google entienda cada ficha como un anuncio
 * inmobiliario con precio, superficie y ubicación. Solo se incluye lo que existe.
 */

type Dict = Record<string, unknown>

const BUILDING_TYPE: Record<string, string> = {
  casa: 'SingleFamilyResidence',
  departamento: 'Apartment',
  suite: 'Apartment',
  terreno: 'Place',
  local: 'Place',
  oficina: 'Place',
}

function clean(obj: Dict): Dict {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '' && v !== 0))
}

function address(sectorLabel: string): Dict {
  return clean({
    '@type': 'PostalAddress',
    addressLocality: sectorLabel,
    addressRegion: 'Pichincha',
    addressCountry: 'EC',
  })
}

function area(m2: number | null | undefined): Dict | undefined {
  return m2 ? { '@type': 'QuantitativeValue', value: m2, unitCode: 'MTK' } : undefined
}

function offer(price: number | null | undefined, url: string, available = true): Dict | undefined {
  if (!price) return undefined
  return {
    '@type': 'Offer',
    price,
    priceCurrency: 'USD',
    availability: available ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
    url,
    seller: { '@type': 'RealEstateAgent', name: site.name },
  }
}

// La ubicación exacta solo se publica si la inmobiliaria la marcó como exacta.
function geo(location: { lat: number | null; lng: number | null; exact: boolean } | undefined): Dict | undefined {
  if (!location?.exact || location.lat === null || location.lng === null) return undefined
  return { '@type': 'GeoCoordinates', latitude: location.lat, longitude: location.lng }
}

export function propertySchema(p: Property, title: string, sectorLabel: string, url: string): Dict {
  return clean({
    '@type': 'RealEstateListing',
    name: title,
    description: p.summary || p.description?.slice(0, 300),
    url,
    image: p.images.slice(0, 6).map((i) => i.url),
    datePosted: p.createdAt?.slice(0, 10),
    offers: offer(p.price, url),
    about: clean({
      '@type': BUILDING_TYPE[p.type] ?? 'Place',
      name: title,
      address: address(sectorLabel),
      geo: geo(p.location),
      floorSize: area(p.builtM2 || p.totalM2),
      numberOfRooms: p.type === 'terreno' ? undefined : p.bedrooms,
      numberOfBathroomsTotal: p.type === 'terreno' ? undefined : p.bathrooms,
    }),
  })
}

export function projectSchema(p: Project, title: string, sectorLabel: string, url: string): Dict {
  return clean({
    '@type': 'RealEstateListing',
    name: title,
    description: p.summary || p.description?.slice(0, 300),
    url,
    image: p.images.slice(0, 6).map((i) => i.url),
    offers: p.priceFrom
      ? { '@type': 'AggregateOffer', lowPrice: p.priceFrom, priceCurrency: 'USD', offerCount: p.totalUnits || undefined }
      : undefined,
    about: clean({
      '@type': 'Residence',
      name: title,
      address: address(sectorLabel),
      geo: geo(p.location),
    }),
  })
}

export function unitSchema(u: Unit, projectTitle: string, sectorLabel: string, url: string): Dict {
  return clean({
    '@type': 'RealEstateListing',
    name: `${u.name} · ${projectTitle}`,
    description: u.description,
    url,
    image: [u.floorPlan?.url, ...u.images.map((i) => i.url)].filter(Boolean),
    offers: offer(u.price, url, u.status === 'available'),
    about: clean({
      '@type': BUILDING_TYPE[u.type] ?? 'Place',
      address: address(sectorLabel),
      floorSize: area(u.builtM2),
      numberOfRooms: u.bedrooms,
      numberOfBathroomsTotal: u.bathrooms,
    }),
  })
}

export function postSchema(p: Post, url: string): Dict {
  return clean({
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt,
    image: p.cover?.url,
    url,
    datePublished: p.publishedAt?.slice(0, 10),
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
  })
}
