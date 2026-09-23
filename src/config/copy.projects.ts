/** Copy extra del área de proyectos (complementa copy.public.ts). */
export const copyProjects = {
  seoDescription:
    'Proyectos inmobiliarios en planos, en construcción y por estrenar en Cumbayá, Tumbaco y el valle de Quito.',
  inventoryText: 'Elige una unidad para ver su plano, fotos y precio.',
  unitsCount: (n: number) => (n === 1 ? '1 unidad' : `${n} unidades`),
  unitArea: 'Área construida',
  unitOf: 'Unidad de',
  unitPrice: 'Precio',
  unitContactTitle: 'Me interesa esta unidad',
  similarTitle: 'Proyectos similares',
  galleryOpen: 'Ampliar imagen',
  sectionsLabel: 'Secciones del proyecto',
  noImages: 'Pronto publicaremos los renders de este proyecto.',
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
