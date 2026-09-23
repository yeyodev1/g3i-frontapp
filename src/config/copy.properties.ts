/** Copy del área de propiedades que no está en site.ts ni en copy.public.ts. */
export const copyProperties = {
  back: 'Volver a propiedades',
  inSale: 'en venta',
  in: 'en',
  mapEmpty: 'No hay propiedades con ubicación para estos filtros.',
  mapCount: (n: number) => (n === 1 ? '1 propiedad en el mapa' : `${n} propiedades en el mapa`),
  viewToggle: 'Cambiar vista',
  pricePlaceholder: 'USD',
  photoOf: (i: number, total: number) => `Foto ${i} de ${total}`,
}
