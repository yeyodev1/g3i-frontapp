/**
 * Textos del portal de administración. Lo usa una persona no técnica: frases
 * cortas, en tono amable, y siempre diciendo qué pasa después de cada acción.
 */
export const adminCopy = {
  brand: 'Portal G3i',
  nav: [
    { label: 'Inicio', to: '/admin', icon: 'fa-solid fa-house' },
    { label: 'Propiedades', to: '/admin/propiedades', icon: 'fa-solid fa-house-chimney' },
    { label: 'Proyectos', to: '/admin/proyectos', icon: 'fa-solid fa-building' },
    { label: 'Formularios', to: '/admin/formularios', icon: 'fa-solid fa-inbox' },
    { label: 'Blog', to: '/admin/blog', icon: 'fa-solid fa-pen-nib' },
    { label: 'Preguntas', to: '/admin/preguntas', icon: 'fa-solid fa-circle-question' },
    { label: 'Asesores', to: '/admin/asesores', icon: 'fa-solid fa-user-tie' },
    { label: 'Testimonios', to: '/admin/testimonios', icon: 'fa-solid fa-quote-left' },
    { label: 'Socios', to: '/admin/socios', icon: 'fa-solid fa-handshake' },
    { label: 'Ajustes', to: '/admin/ajustes', icon: 'fa-solid fa-sliders' },
    { label: 'Mi cuenta', to: '/admin/cuenta', icon: 'fa-solid fa-user-gear' },
  ],
  viewSite: 'Ver sitio',
  logout: 'Cerrar sesión',
  loggedOut: 'Cerraste sesión',

  login: {
    eyebrow: 'Portal de administración',
    title: 'Ingresa a tu portal',
    text: 'Desde aquí publicas y actualizas las propiedades y proyectos del sitio.',
    submit: 'Ingresar',
    loading: 'Ingresando…',
    notAdmin: 'Esta cuenta no tiene acceso al portal.',
    back: 'Volver al sitio',
    showcaseEyebrow: 'G3i · Negocios inmobiliarios',
    showcaseTitle: 'Tu vitrina en el valle, siempre al día.',
    showcaseText: 'Publica, actualiza y marca como vendidas tus propiedades en minutos.',
    statProperties: 'propiedades publicadas',
    statProjects: 'proyectos',
    emailLabel: 'Correo',
    passwordLabel: 'Contraseña',
    secure: 'Acceso privado del equipo G3i',
  },

  account: {
    title: 'Mi cuenta',
    passwordTitle: 'Cambiar contraseña',
    passwordHelp: 'Usa al menos 8 caracteres. Mezcla letras y números para que sea segura.',
    mismatch: 'Las contraseñas nuevas no coinciden.',
    tooShort: 'La contraseña nueva debe tener al menos 8 caracteres.',
    saved: 'Listo, tu contraseña se cambió.',
  },

  status: {
    property: {
      draft: 'Borrador',
      published: 'Publicada',
      hidden: 'Oculta',
      sold: 'Vendida',
    },
    project: {
      draft: 'Borrador',
      published: 'Publicado',
      hidden: 'Oculto',
      'sold-out': 'Agotado',
    },
    unit: {
      available: 'Disponible',
      reserved: 'Reservada',
      sold: 'Vendida',
    },
    lead: {
      new: 'Nuevo',
      contacted: 'Contactado',
      closed: 'Cerrado',
    },
    crm: {
      pending: 'Pendiente',
      sent: 'Enviado al CRM',
      failed: 'Falló el envío',
      skipped: 'Sin CRM',
    },
  },

  statusHelp: {
    draft: 'Solo tú la ves. Úsalo mientras la completas.',
    published: 'Visible para todos en el sitio.',
    hidden: 'Se retira del sitio sin borrarla. Puedes volver a publicarla.',
    sold: 'Deja de aparecer en el sitio y queda como vendida.',
    'sold-out': 'Todas las unidades se vendieron. Deja de aparecer en el sitio.',
  } as Record<string, string>,

  leadKinds: {
    property: 'Propiedad',
    project: 'Proyecto',
    unit: 'Unidad',
    sell: 'Vender mi propiedad',
    general: 'General',
    'work-with-us': 'Trabajar con nosotros',
    interested: 'Interesado',
  } as Record<string, string>,

  form: {
    save: 'Guardar cambios',
    create: 'Guardar',
    saving: 'Guardando…',
    saved: 'Cambios guardados',
    created: 'Guardado. Ya puedes seguir completando.',
    cancel: 'Cancelar',
    fixErrors: 'Revisa los campos marcados en rojo.',
    unsavedTitle: '¿Salir sin guardar?',
    unsavedText: 'Hiciste cambios que todavía no se guardaron. Si sales, se pierden.',
    unsavedConfirm: 'Salir sin guardar',
    unsavedCancel: 'Seguir editando',
    unsavedBar: 'Tienes cambios sin guardar',
    preview: 'Vista previa',
    previewDraft:
      'Esta publicación está en borrador: el público todavía no la ve. La vista previa solo funcionará cuando esté publicada.',
    previewNeedsSave: 'Guarda primero para poder ver la vista previa.',
    loadError: 'No pudimos cargar la información. Intenta de nuevo.',
  },

  delete: {
    title: '¿Eliminar definitivamente?',
    property:
      'Se borrará la propiedad con todas sus fotos, videos y planos. Esto no se puede deshacer. Si solo quieres quitarla del sitio, usa "Ocultar".',
    project:
      'Se borrará el proyecto con sus unidades, renders y brochure. Esto no se puede deshacer. Si solo quieres quitarlo del sitio, usa "Ocultar".',
    generic: 'Esto no se puede deshacer.',
    confirm: 'Sí, eliminar',
    done: 'Eliminado',
  },

  upload: {
    drop: 'Arrastra aquí tus fotos o toca para elegirlas',
    dropHint: 'Puedes elegir varias a la vez. JPG, PNG o WEBP; las muy pesadas se comprimen solas.',
    unavailable:
      'Por ahora no se pueden subir archivos: falta configurar el servicio de imágenes (Cloudinary). Avísale a soporte técnico; lo demás del formulario sí se puede guardar.',
    tooBig: 'es demasiado pesado',
    compressed: 'se comprimió para poder subirla',
    compressFailed: 'no se pudo comprimir lo suficiente',
    reduceHint: 'Reduce su peso y vuelve a intentarlo.',
    failed: 'No se pudo subir',
    main: 'Principal',
    makeMain: 'Marcar como foto principal',
    maxReached: 'Llegaste al máximo de fotos permitidas',
    minRecommended:
      'Te recomendamos subir al menos 5 fotos: las publicaciones con más fotos reciben más consultas.',
  },

  empty: {
    properties: 'Todavía no hay propiedades con estos filtros.',
    projects: 'Todavía no hay proyectos con estos filtros.',
    units: 'Este proyecto aún no tiene unidades. Agrega la primera.',
    leads: 'No hay formularios con estos filtros.',
    posts: 'Todavía no hay entradas en el blog.',
    list: 'Todavía no hay nada aquí. Agrega el primero.',
  },

  projectUnits: {
    title: 'Unidades disponibles',
    text: 'El inventario del proyecto: cada unidad con su precio, plano y estado. Las vendidas desaparecen del sitio y el «precio desde» se calcula solo.',
    saveFirst: 'Guarda el proyecto primero y aquí mismo podrás cargar sus unidades.',
    empty: 'Este proyecto todavía no tiene unidades cargadas.',
    add: 'Agregar unidad',
    manage: 'Administrar unidades (vender, reservar, editar)',
  },

  help: {
    landUse:
      'Sale como filtro en el buscador de terrenos. La lista se edita en Ajustes del sitio → Usos de terreno.',
    locality:
      'Barrio, urbanización o proyecto. Sale junto al sector en las tarjetas: «Cumbayá · Kentia».',
    badge: 'Opcional. Texto corto que se muestra sobre la foto principal.',
    code: 'Tu código interno. Si lo dejas vacío se genera uno automáticamente.',
    summary: 'Una o dos frases que aparecen en la tarjeta del listado (máximo 220 caracteres).',
    description: 'Cuenta todo sobre el inmueble. Deja una línea en blanco para separar párrafos.',
    sector: 'El sector donde aparecerá en los filtros del sitio.',
    address:
      'Una referencia, por ejemplo "A dos cuadras del Paseo San Francisco". No hace falta la dirección exacta.',
    map: 'Toca el mapa para poner el pin. Puedes arrastrarlo para ajustarlo.',
    exact: 'Si lo apagas, el público verá un círculo aproximado en lugar del punto exacto.',
    radius: 'Tamaño del círculo que verá el público.',
    photos:
      'La primera foto es la principal: es la que se ve en el listado. Mínimo recomendado 5, máximo 25.',
    videos: 'Videos cortos (hasta 100 MB) o un enlace de YouTube.',
    floorPlans: 'Sube los planos como imagen (JPG o PNG).',
    ageYears: 'Déjalo vacío si es nueva.',
    amenities: 'Marca todo lo que tiene. Solo se mostrará lo que marques.',
    price: 'Precio de venta en dólares, sin puntos ni comas.',
    hoa: 'Valor mensual de la alícuota en dólares.',
    featured:
      'Aparece primero en «Las más buscadas» (propiedades) o en los proyectos de Inicio. Después se completan solas con las más visitadas.',
    featuredOrder: '1 = la primera. Sin número va después de las numeradas.',
    developer: 'Opcional. Nombre de la constructora o promotora.',
    deliveryDate: 'Escríbelo como quieras que se lea, por ejemplo "Febrero 2027".',
    totalUnits:
      'Solo el número total del proyecto. Cada unidad (precio, plano, vendida o no) se carga más abajo, en «Unidades disponibles».',
    priceFrom:
      'Si el proyecto tiene unidades disponibles, este valor se calcula solo con la más barata.',
    highlights:
      'Beneficios cortos que se muestran como lista, por ejemplo "Ubicación estratégica".',
    brochure: 'Un PDF de hasta 20 MB que el público puede descargar.',
    renders: 'Renders o fotos del proyecto. La primera es la principal.',
  },
}

export type AdminCopy = typeof adminCopy
