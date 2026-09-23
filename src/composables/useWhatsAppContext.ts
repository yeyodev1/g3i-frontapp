import { computed, onUnmounted, ref } from 'vue'
import { whatsappForListing, whatsappLink } from '@/config/site'

interface ListingContext {
  title: string
  code: string
}

// Estado de módulo: las fichas lo setean y el botón flotante lo lee.
const listing = ref<ListingContext | null>(null)

export function useWhatsAppContext() {
  const href = computed(() =>
    listing.value
      ? whatsappForListing(listing.value.title, listing.value.code, window.location.href)
      : whatsappLink(),
  )

  return { listing, href }
}

/**
 * Para vistas de detalle: registra el inmueble mientras la vista esté montada.
 * Al salir se limpia solo, así el flotante vuelve al mensaje genérico.
 */
export function useListingWhatsApp() {
  const { href } = useWhatsAppContext()

  function setListing(title: string, code: string) {
    listing.value = { title, code }
  }

  onUnmounted(() => {
    listing.value = null
  })

  return { setListing, href }
}
