import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import { copy } from '@/config/copy.public'

/** Web Share API en móvil; en escritorio copia el enlace (o abre WhatsApp). */
export function useShare() {
  const toast = useToastStore()
  const menuOpen = ref(false)
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  async function share(title: string, text = '') {
    const url = window.location.href
    if (canNativeShare) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (error) {
        // El usuario canceló: no hay nada que hacer.
        if ((error as DOMException)?.name === 'AbortError') return
      }
    }
    menuOpen.value = !menuOpen.value
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success(copy.common.copied)
    } catch {
      window.prompt(copy.common.copyLink, window.location.href)
    }
    menuOpen.value = false
  }

  function whatsappShareUrl(title: string) {
    return `https://wa.me/?text=${encodeURIComponent(`${title} ${window.location.href}`)}`
  }

  return { share, copyLink, whatsappShareUrl, menuOpen }
}
