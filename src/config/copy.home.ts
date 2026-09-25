/** Copy de la home, el layout público y el mapa que no está en site.ts ni en copy.public.ts. */
export const copyHome = {
  // Buscador de la portada
  search: {
    label: 'Buscar propiedades',
    sector: 'Sector',
    sectorAll: 'Todo el valle',
    type: 'Tipo de propiedad',
    typeAll: 'Seleccionar…',
    price: 'Precio',
    priceAll: 'Cualquier precio',
    button: 'Buscar',
    popular: 'Más buscadas',
  },

  // Banda de cifras bajo el buscador. Las claves coinciden con STAT_ICONS del backend.
  stats: {
    label: 'G3i en cifras',
    icons: [
      { key: 'casa', label: 'Casa', icon: 'fa-solid fa-house' },
      { key: 'departamento', label: 'Edificio', icon: 'fa-solid fa-building' },
      { key: 'terreno', label: 'Árbol / terreno', icon: 'fa-solid fa-tree' },
      { key: 'propiedades', label: 'Casas', icon: 'fa-solid fa-house-chimney' },
      { key: 'proyectos', label: 'Proyectos', icon: 'fa-solid fa-city' },
      { key: 'llave', label: 'Llave', icon: 'fa-solid fa-key' },
      { key: 'premio', label: 'Trayectoria', icon: 'fa-solid fa-award' },
      { key: 'clientes', label: 'Clientes', icon: 'fa-solid fa-handshake' },
    ],
    // Respaldo con los conteos reales cuando el panel no define cifras.
    fallback: [
      { type: 'casa', icon: 'casa', label: 'Casas' },
      { type: 'departamento', icon: 'departamento', label: 'Departamentos' },
      { type: 'terreno', icon: 'terreno', label: 'Terrenos' },
    ],
    total: 'Propiedades',
  },

  featured: {
    eyebrow: 'Propiedades',
    title: 'Las más buscadas',
    link: 'Ver todas',
  },

  projects: {
    eyebrow: 'Invierte en un proyecto',
    title: 'Descubre los mejores proyectos',
    link: 'Ver todos',
    stagesLabel: 'Etapas de proyecto',
  },

  about: {
    eyebrow: '¿Por qué pensar en Cumbayá?',
    title: 'La perla geográfica a la orilla de Quito',
    text: 'Cumbayá se formó en base a un estilo de vida compartido por sus habitantes: la ciudad de Quito, a veces fría, ruidosa y congestionada, es intercambiada por el entorno familiar, seguro y natural del valle.\n\nApoyamos a familias, inversionistas y empresarios a encontrar el bien inmueble que más se ajuste a sus necesidades y proyectos.',
    imageAlt: 'Vida en el valle de Cumbayá',
    traits: [
      { icon: 'fa-solid fa-tree', label: 'Natural' },
      { icon: 'fa-solid fa-shield-halved', label: 'Seguro' },
      { icon: 'fa-solid fa-people-roof', label: 'Familiar' },
    ],
  },

  services: {
    eyebrow: 'Asesoría completa',
    title: 'Excelencia y profesionalidad en cada proceso',
    // Solo venta: «Arrendadores» del ejemplo se reemplaza por Inversionistas.
    items: [
      {
        icon: 'fa-solid fa-house',
        title: 'Compradores',
        text: 'Encontramos el inmueble que se ajusta a tu proyecto de vida.',
      },
      {
        icon: 'fa-solid fa-key',
        title: 'Vendedores',
        text: 'Comercializamos tu propiedad optimizando tiempo y recursos.',
      },
      {
        icon: 'fa-solid fa-chart-line',
        title: 'Inversionistas',
        text: 'Te asesoramos para invertir en proyectos con plusvalía en el valle.',
      },
      {
        icon: 'fa-regular fa-building',
        title: 'Constructores',
        text: 'Comercialización, asesoría y ventas de proyectos.',
      },
    ],
  },

  testimonials: {
    eyebrow: 'Testimonios',
    prev: 'Testimonio anterior',
    next: 'Siguiente testimonio',
  },

  partnersEyebrow: 'Socios comerciales',

  blog: {
    eyebrow: 'Blog',
    title: 'Guías para comprar e invertir',
    link: 'Ir al blog',
    faqTitle: '¿Tienes dudas sobre comprar o vender?',
    faqLink: 'Preguntas frecuentes',
  },

  sellCta: {
    eyebrow: 'Bienvenido al mundo de G3i',
    title: '¿Quieres vender tu propiedad en el valle?',
    button: 'Quiero vender mi propiedad',
  },

  footer: {
    properties: 'Propiedades',
    company: 'G3i',
    contact: 'Contacto',
    propertyLinks: [
      { label: 'Todas las propiedades', type: '' },
      { label: 'Casas', type: 'casa' },
      { label: 'Departamentos', type: 'departamento' },
      { label: 'Terrenos', type: 'terreno' },
    ],
    companyLinks: [
      { label: 'Proyectos', to: '/proyectos' },
      { label: 'Busca en mapa', to: '/mapa-del-valle' },
      { label: 'Blog', to: '/blog' },
      { label: 'Conócenos', to: '/conocenos' },
      { label: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
      { label: 'Contáctanos', to: '/contacto' },
    ],
    whatsapp: 'Escríbenos por WhatsApp',
    madeBy: 'Hecho por',
  },

  propertiesError: 'No pudimos cargar las propiedades.',

  // Legado: los usan el mapa del valle y sus filtros.
  anyType: 'Cualquier tipo',
  anySector: 'Cualquier sector',
  mapFilters: 'Filtros del mapa',
  mapList: 'Inmuebles visibles',
  mapLoading: 'Cargando el mapa…',
  mapError: 'No pudimos cargar los inmuebles del mapa.',
  showList: 'Ver lista',
  hideList: 'Ocultar lista',
  clear: 'Limpiar',
} as const
