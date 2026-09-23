/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan. Lo que la inmobiliaria cambia seguido
 * (hero, más buscadas, redes) viene de /api/site y estos valores son el respaldo.
 */
export const site = {
  name: 'G3i Inmobiliaria',
  shortName: 'G3i',
  tagline: 'Negocios inmobiliarios en Cumbayá y Tumbaco',
  description:
    'Casas, departamentos, terrenos y proyectos en venta en Cumbayá, Tumbaco y el valle de Quito. Asesoría inmobiliaria personalizada.',
  url: 'https://g3i.ec',
  logo: '/logo-g3i.png',
  city: 'Quito',
  // Pendiente: la clienta envía el correo institucional.
  email: '',
  phone: '0995806119',
  // Solo dígitos con código de país
  whatsapp: '593995806119',
  // Pendiente: la clienta envía los enlaces.
  social: {
    instagram: '',
    facebook: '',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Propiedades', to: '/propiedades' },
    { label: 'Proyectos', to: '/proyectos' },
    { label: 'Buscar en el mapa', to: '/mapa' },
    { label: 'Blog', to: '/blog' },
    { label: 'Conócenos', to: '/conocenos' },
  ],
  // Discreto a propósito: la clienta pidió que no compita con las propiedades.
  sellLink: { label: 'Vender mi propiedad', to: '/vender-mi-propiedad' },

  home: {
    heroTitle: 'Encuentra tu próximo hogar en el valle',
    heroSubtitle:
      'Casas, departamentos, terrenos y proyectos seleccionados en Cumbayá, Tumbaco y sus alrededores.',
    searchTypeLabel: '¿Qué buscas?',
    searchSectorLabel: '¿Dónde?',
    searchButton: 'Buscar',
    popularTitle: 'Más buscadas',
    featuredEyebrow: 'Propiedades destacadas',
    featuredTitle: 'Listas para visitar',
    projectsEyebrow: 'Invierte en un proyecto',
    projectsTitle: 'Proyectos en planos, en construcción y por estrenar',
    mapEyebrow: 'Buscar en el mapa',
    mapTitle: 'Explora por sector',
    mapText: 'Acércate a la zona que te interesa y descubre lo que hay disponible.',
    partnersTitle: 'Empresas que confían en nosotros',
    testimonialsEyebrow: 'Testimonios',
    testimonialsTitle: 'Lo que dicen nuestros clientes',
    blogEyebrow: 'Blog',
    blogTitle: 'Guías para comprar e invertir',
    statsLabels: {
      properties: 'Propiedades disponibles',
      projects: 'Proyectos',
      sectors: 'Sectores',
    },
  },

  listing: {
    propertiesTitle: 'Propiedades en venta',
    propertiesText: 'Reventas y unidades individuales seleccionadas por nuestro equipo.',
    projectsTitle: 'Proyectos inmobiliarios',
    projectsText: 'Desarrollos completos con inventario actualizado de unidades disponibles.',
    empty: 'No encontramos resultados con esos filtros. Prueba ampliando la búsqueda.',
    clearFilters: 'Limpiar filtros',
  },

  detail: {
    contactTitle: 'Agenda una visita',
    contactText: 'Déjanos tus datos y un asesor te contactará en breve.',
    whatsappCta: 'Escribir por WhatsApp',
    shareCta: 'Compartir',
    relatedProperties: 'Otras propiedades que te pueden interesar',
    relatedProjects: 'Proyectos similares',
    brochureCta: 'Descargar brochure',
    unitsTitle: 'Unidades disponibles',
    amenitiesTitle: 'Amenidades',
    featuresTitle: 'Características',
    descriptionTitle: 'Descripción',
    locationTitle: 'Ubicación',
    approxLocation: 'Ubicación aproximada',
  },

  sell: {
    eyebrow: 'Vender mi propiedad',
    title: '¿Quieres vender tu propiedad?',
    text: 'Te ayudamos a valorarla y a encontrar al comprador indicado. Cuéntanos un poco y te contactamos.',
    interests: [
      { key: 'sell', label: 'Vender mi propiedad' },
      { key: 'interested', label: 'Estoy interesado en comprar' },
      { key: 'work-with-us', label: 'Trabajar con ustedes' },
    ],
    sellPropertyTypes: [
      { key: 'terreno', label: 'Terreno' },
      { key: 'casa', label: 'Casa' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'proyecto', label: 'Proyecto' },
    ],
    success: 'Gracias. Recibimos tus datos y un asesor te contactará pronto.',
  },

  about: {
    eyebrow: 'Conócenos',
    title: 'Un equipo que conoce el valle',
    teamTitle: 'Nuestros asesores',
  },

  faq: {
    title: 'Preguntas frecuentes',
    text: 'Lo que más nos preguntan al comprar o vender una propiedad.',
  },

  footer: {
    text: 'Negocios inmobiliarios en Cumbayá, Tumbaco y el valle de Quito. Solo venta.',
    rights: 'Todos los derechos reservados.',
  },
} as const

export function whatsappLink(message = 'Hola, quiero más información'): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

/** Mensaje de WhatsApp con el identificador del inmueble, como pidió la clienta. */
export function whatsappForListing(title: string, code: string, url: string): string {
  const ref = code ? ` (código ${code})` : ''
  return whatsappLink(`Hola, me interesa "${title}"${ref}. Lo vi en ${url}`)
}
