/**
 * Copy de las páginas internas en el lenguaje del rediseño (sept. 2026):
 * mapa del valle, conócenos, vender, contacto, blog y preguntas frecuentes.
 */
export const copyPages = {
  valley: {
    eyebrow: 'Busca en mapa',
    title: 'Propiedades por sector',
    text: 'Las zonas del valle con sus límites parroquiales. Elige una para ver lo que tenemos disponible en ella.',
    description:
      'Mapa de Cumbayá, Tumbaco, Puembo y el valle de Quito con las propiedades y proyectos en venta de G3i por sector.',
    zonesLabel: 'Zonas del valle',
    allZones: 'Todo el valle',
    soon: 'Próximamente',
    count: (n: number, kind: string) => {
      const word = kind === 'project' ? ['proyecto', 'proyectos'] : ['propiedad', 'propiedades']
      return `${n} ${n === 1 ? word[0] : word[1]}`
    },
    kinds: [
      { key: 'all', label: 'Todo' },
      { key: 'property', label: 'Propiedades' },
      { key: 'project', label: 'Proyectos' },
    ],
    kindLabel: 'Mostrar',
    filtersTitle: 'Filtros',
    filtersToggle: 'Filtrar',
    clear: 'Limpiar',
    zoneLabel: 'Zona',
    typeLabel: 'Tipo de propiedad',
    allTypes: 'Todos los tipos',
    stageLabel: 'Etapa',
    allStages: 'Todas las etapas',
    priceLabel: 'Precio',
    allPrices: 'Cualquier precio',
    layers: [
      { key: 'map', label: 'Mapa' },
      { key: 'sat', label: 'Satélite' },
    ],
    layersLabel: 'Tipo de mapa',
    cluster: (n: number) => `${n} inmuebles aquí: acercar`,
    results: (n: number) => (n === 1 ? '1 inmueble' : `${n} inmuebles`),
    empty: (zone: string) =>
      `Pronto nuevas propiedades en ${zone}. Escríbenos para conocer oportunidades fuera del portafolio publicado.`,
    emptyAll: 'No hay inmuebles con estos filtros. Prueba con otro tipo.',
    // Pedido de la clienta (24/9): «Nuestras propiedades» en vez de «Inmuebles en todo el valle».
    listLabel: (zone?: string) =>
      zone ? `Nuestras propiedades en ${zone}` : 'Nuestras propiedades',
    projectTag: 'Proyecto',
    from: 'Desde',
    seeProperty: 'Ver propiedad',
    seeProject: 'Ver proyecto',
    approx: 'Ubicación aproximada',
    error: 'No pudimos cargar el mapa.',
    retry: 'Reintentar',
    mapLabel: 'Mapa del valle con las zonas y los inmuebles',
    attribution: 'Límites parroquiales: GAD vía OpenStreetMap',
  },

  about: {
    eyebrow: 'Conócenos',
    welcome: 'Bienvenido al mundo de G3i',
    values: [
      { icon: 'fa-solid fa-tree', label: 'Natural' },
      { icon: 'fa-solid fa-shield-halved', label: 'Seguro' },
      { icon: 'fa-solid fa-people-roof', label: 'Familiar' },
    ],
    teamEyebrow: 'Nuestro equipo',
    teamTitle: 'Asesores inmobiliarios G3i',
    teamText:
      'Personas que conocen el valle y te acompañan en cada paso de la compra o venta de tu propiedad.',
    ctaEyebrow: 'Hablemos',
    ctaTitle: '¿Buscas una propiedad o quieres vender la tuya?',
    ctaButton: 'Contáctanos',
  },

  advisor: {
    whatsapp: (name: string) => `WhatsApp de ${name}`,
    email: (name: string) => `Correo de ${name}`,
  },

  contact: {
    eyebrow: 'Contáctanos',
    title: '¡Sueña, siente,',
    titleEm: 'vive tu espacio!',
    paragraphs: [
      'G3i direcciona a sus clientes a compartir la visión de un lugar mágico como el Valle. Ya sea terreno, casa o departamento, contamos con un amplio portafolio de propiedades exclusivas para una inmensa diversidad de gustos y exigencias.',
      'Brindamos una asesoría completa a vendedores, compradores e inversionistas. Nuestro objetivo es excelencia y profesionalidad para optimizar tiempo y recursos en la comercialización de inmuebles en el valle de Cumbayá.',
    ],
    welcome: 'Bienvenido al mundo de G3i',
    description:
      'Contacta a G3i Inmobiliaria: vende tu propiedad, compra en el valle o trabaja con nosotros.',
    formTitle: 'Deja tus datos',
    interestLabel: '¿En qué te podemos ayudar?',
    // ?interes=vender|comprar|trabajar|consulta preselecciona la pestaña.
    interests: [
      {
        key: 'sell',
        query: 'vender',
        label: 'Vender mi propiedad',
        icon: 'fa-solid fa-house-circle-check',
      },
      {
        key: 'interested',
        query: 'comprar',
        label: 'Estoy interesado en comprar',
        icon: 'fa-solid fa-key',
      },
      {
        key: 'work-with-us',
        query: 'trabajar',
        label: 'Trabajar con nosotros',
        icon: 'fa-solid fa-user-tie',
      },
      { key: 'general', query: 'consulta', label: 'Otra consulta', icon: 'fa-regular fa-comment' },
    ],
    sellHint: 'Cuéntanos dónde está y qué tipo de propiedad es: te contactamos para valorarla.',
    whatsappSuffix: 'WhatsApp',
    photoAlt: 'Interior de una propiedad en el valle',
    channelsLabel: 'Canales de contacto',
  },

  blog: {
    eyebrow: 'Blog',
    title: 'Guías para comprar',
    titleEm: 'e invertir en el valle',
    text: 'Consejos, trámites y novedades para comprar, vender e invertir en Cumbayá, Tumbaco y el valle de Quito.',
    faqEyebrow: '¿Tienes dudas?',
    faqTitle: 'Preguntas y respuestas',
    faqText:
      'Lo que más nos preguntan al comprar o vender una propiedad en el valle, respondido por nuestro equipo.',
    faqLink: 'Ver preguntas frecuentes',
    postsTitle: 'Últimos artículos',
  },

  post: {
    eyebrow: 'Blog G3i',
    ctaEyebrow: '¿Buscas propiedad en el valle?',
    ctaTitle: 'Conoce nuestro portafolio',
    ctaButton: 'Ver propiedades',
  },

  faq: {
    eyebrow: 'Ayuda',
    title: 'Preguntas',
    titleEm: 'frecuentes',
    moreEyebrow: '¿No encontraste tu respuesta?',
    moreTitle: 'Escríbenos y te respondemos',
    whatsapp: 'Escribir por WhatsApp',
    contact: 'Contáctanos',
  },
} as const
