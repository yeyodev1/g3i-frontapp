import { reactive } from 'vue'

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

// Estado de módulo: un solo diálogo para todo el portal, pintado por
// AdminConfirmHost dentro del layout.
const state = reactive({
  open: false,
  options: { title: '' } as ConfirmOptions,
  resolve: null as ((value: boolean) => void) | null,
})

function answer(value: boolean) {
  state.open = false
  state.resolve?.(value)
  state.resolve = null
}

/** `if (await confirm({...}))` en lugar de manejar un modal por vista. */
function confirm(options: ConfirmOptions): Promise<boolean> {
  // Si había otro abierto, se cancela para no dejar promesas colgadas.
  state.resolve?.(false)
  state.options = options
  state.open = true
  return new Promise((resolve) => {
    state.resolve = resolve
  })
}

export function useAdminConfirm() {
  return { state, confirm, answer }
}
