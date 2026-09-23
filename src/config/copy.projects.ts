/** Copy extra del área de proyectos (complementa copy.public.ts). */
export const copyProjects = {
  seoDescription:
    'Proyectos inmobiliarios en planos, en construcción y por estrenar en Cumbayá, Tumbaco y el valle de Quito.',
  inventoryText: 'Elige una unidad para ver su plano, fotos y precio.',
  unitsCount: (n: number) => (n === 1 ? '1 unidad' : `${n} unidades`),
  unitArea: 'Área construida',
  unitOf: 'Unidad de',
  unitPrice: 'Precio de venta',
  unitContactTitle: 'Me interesa esta unidad',
  similarTitle: 'Proyectos similares',
  similarEyebrow: 'Otros proyectos G3i',
  galleryOpen: 'Ampliar imagen',
  sectionsLabel: 'Secciones del proyecto',
  noImages: 'Pronto publicaremos los renders de este proyecto.',

  // Listado
  listCount: (n: number) => (n === 1 ? '1 proyecto' : `${n} proyectos`),
  allStages: 'Todos',
  filtersLabel: 'Filtrar proyectos',
  seeProject: 'Ver proyecto',
  deliveryShort: 'Entrega',

  // Ficha del proyecto
  back: 'Proyectos G3i',
  requestInfo: 'Solicitar información',
  fact: {
    sector: 'Sector',
    from: 'Desde',
    sells: 'Tipología',
    delivery: 'Entrega',
  },
  sections: [
    { id: 'galeria', label: 'Galería' },
    { id: 'vision-general', label: 'Visión general' },
    { id: 'descripcion', label: 'Descripción' },
    { id: 'amenidades', label: 'Amenidades' },
    { id: 'unidades', label: 'Unidades' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'contacto', label: 'Contacto' },
  ],
  galleryEyebrow: 'Galería',
  galleryTitle: 'Recorre el proyecto',
  galleryMore: (n: number) => `+${n}`,
  overviewEyebrow: 'Visión general',
  overviewTitle: (types: string, sector: string) => (types ? `${types} en ${sector}` : `Proyecto en ${sector}`),
  descriptionEyebrow: 'Descripción',
  descriptionTitle: 'Sobre el proyecto',
  brochure: 'Descargar brochure',
  amenitiesEyebrow: 'Amenidades',
  amenitiesTitle: 'Vivir más allá de tu puerta',
  amenitiesText: (n: number) =>
    n === 1 ? '1 espacio comunal pensado para tu día a día.' : `${n} espacios comunales pensados para cada momento del día.`,
  highlightsTitle: 'Lo que lo hace distinto',
  unitsEyebrow: 'Inventario',
  unitsTitle: 'Elige tu unidad',
  unitsNote: 'Precios referenciales · sujetos a disponibilidad',
  locationEyebrow: 'Ubicación',
  locationText: (sector: string, exact: boolean) =>
    exact ? `${sector}, valle de Quito.` : `${sector}, valle de Quito. Ubicación aproximada: tu asesor te comparte la exacta en la visita.`,
  contactEyebrow: 'Atención personalizada',
  contactTitle: 'Hablemos de este proyecto',
  contactText: 'Te acompañamos desde la primera visita hasta la entrega: disponibilidad, planos, formas de pago y trámites.',
  formTitle: 'Solicita información',
  code: 'Código',

  // Ficha de la unidad
  unitBack: 'Volver al proyecto',
  unitSpecsTitle: 'Características',
  projectRenders: 'Imagen del proyecto',
  unitDescriptionTitle: 'Descripción',

  // Cuando no hay proyectos de un tipo, se ofrecen las propiedades individuales de ese tipo.
  typePlural: {
    casa: 'casas',
    departamento: 'departamentos',
    terreno: 'terrenos',
    suite: 'suites',
    local: 'locales comerciales',
    oficina: 'oficinas',
  } as Record<string, string>,
  noProjectsOfType: (plural: string) => `Por ahora no tenemos proyectos de ${plural}.`,
  fallbackTitle: (n: number, plural: string) =>
    n === 1 ? `Tenemos 1 propiedad en venta de este tipo` : `Tenemos ${n} ${plural} en venta`,
  fallbackText: 'Están publicados como propiedades individuales, listos para visitar.',
  fallbackAll: (plural: string) => `Ver todos los ${plural}`,
}
