import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useAdminConfirm } from './useAdminConfirm'
import { adminCopy } from '@/config/copy.admin'

/** Pregunta antes de salir de un formulario con cambios sin guardar. */
export function useAdminUnsaved(dirty: Ref<boolean>) {
  const { confirm } = useAdminConfirm()

  onBeforeRouteLeave(async () => {
    if (!dirty.value) return true
    return confirm({
      title: adminCopy.form.unsavedTitle,
      message: adminCopy.form.unsavedText,
      confirmLabel: adminCopy.form.unsavedConfirm,
      cancelLabel: adminCopy.form.unsavedCancel,
      danger: true,
    })
  })

  // Cerrar la pestaña o recargar: el navegador muestra su propio aviso.
  function onBeforeUnload(event: BeforeUnloadEvent) {
    if (!dirty.value) return
    event.preventDefault()
    event.returnValue = ''
  }

  onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))
}
