/** Copy del área de propiedades que no está en site.ts ni en copy.public.ts. */
export const copyProperties = {
  back: 'Todas las propiedades',
  inSale: 'en venta',
  in: 'en',
  mapEmpty: 'No hay propiedades con ubicación para estos filtros.',
  mapCount: (n: number) => (n === 1 ? '1 propiedad en el mapa' : `${n} propiedades en el mapa`),
  viewToggle: 'Cambiar vista',
  pricePlaceholder: 'USD',
  photoOf: (i: number, total: number) => `Foto ${i} de ${total}`,

  // Listado
  heroEyebrow: 'Portafolio',
  heroTitle: 'Todas las propiedades',
  allTypes: 'Todos',
  typesLabel: 'Tipo de propiedad',
  price: 'Precio (USD)',
  priceFrom: 'Desde',
  priceTo: 'Hasta',
  showMap: 'Mostrar mapa',
  // Orden: sin `sort` en la URL el API usa «popular» (destacadas primero, luego las más visitadas).
  sortDefault: 'Más buscadas',
  sortOptions: [
    { key: 'recent', label: 'Más recientes' },
    { key: 'price-asc', label: 'Menor precio' },
    { key: 'price-desc', label: 'Mayor precio' },
  ],
  count: (n: number) => (n === 1 ? '1 propiedad' : `${n} propiedades`),

  // Tarjeta
  sale: 'Venta',
  seeMore: 'Ver más',
  save: 'Guardar en favoritos',
  saved: 'Quitar de favoritos',
  frontShort: 'de frente',
  bedroomsShort: 'hab.',

  // Ficha
  salePrice: 'Precio de venta',
  contactTitle: 'Contacte con un asesor inmobiliario G3i',
  schedule: 'Agendar visita',
  related: 'Otras propiedades',
  seeAll: 'Ver todas',
  seeAllPhotos: 'Ver todas las fotos',
}
