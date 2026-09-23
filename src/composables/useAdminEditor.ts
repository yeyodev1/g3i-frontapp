import { computed, nextTick, ref, type Ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import type { ApiError } from '@/types'

export type FormErrors = Record<string, string>

interface EditorOptions<F, E> {
  empty: () => F
  fetch: (id: string) => Promise<E>
  save: (form: F) => Promise<E>
  validate: (form: F) => FormErrors
  /** Adónde ir después de crear, para que recargar no duplique. */
  editRoute: (id: string) => RouteLocationRaw
  beforeSave?: (form: F) => F
}

// structuredClone no acepta proxies reactivos; el formulario es JSON puro.
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** Copia del registro solo con los campos del formulario (sin views, __v, etc.). */
function pickFormFields<F extends object>(base: F, entity: unknown): F {
  const source = (entity ?? {}) as Record<string, unknown>
  const result = { ...base } as Record<string, unknown>
  Object.keys(base).forEach((key) => {
    if (source[key] !== undefined) result[key] = source[key]
  })
  if (typeof source._id === 'string') result._id = source._id
  if (typeof source.slug === 'string') result.slug = source.slug
  return clone(result) as F
}

/**
 * Lógica común de los editores (propiedad, proyecto, entrada del blog):
 * carga, detección de cambios sin guardar, validación y guardado.
 */
export function useAdminEditor<F extends { _id?: string; slug?: string }, E>(
  options: EditorOptions<F, E>,
) {
  const router = useRouter()
  const toast = useToastStore()

  const form = ref(options.empty()) as Ref<F>
  const snapshot = ref(JSON.stringify(form.value))
  const errors = ref<FormErrors>({})
  const loading = ref(false)
  const saving = ref(false)
  const failed = ref(false)

  const isNew = computed(() => !form.value._id)
  const dirty = computed(() => JSON.stringify(form.value) !== snapshot.value)

  function reset(entity?: E) {
    form.value = entity ? pickFormFields(options.empty(), entity) : options.empty()
    snapshot.value = JSON.stringify(form.value)
    errors.value = {}
  }

  async function init(id?: string) {
    failed.value = false
    if (!id) return reset()
    if (form.value._id === id) return
    loading.value = true
    try {
      reset(await options.fetch(id))
    } catch (e) {
      failed.value = true
      toast.error((e as ApiError).message || adminCopy.form.loadError)
    } finally {
      loading.value = false
    }
  }

  async function focusFirstError() {
    await nextTick()
    const el = document.querySelector('.field--error')
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function submit(): Promise<boolean> {
    errors.value = options.validate(form.value)
    if (Object.keys(errors.value).length) {
      toast.error(adminCopy.form.fixErrors)
      focusFirstError()
      return false
    }

    const wasNew = isNew.value
    saving.value = true
    try {
      const payload = options.beforeSave ? options.beforeSave(clone(form.value)) : form.value
      const saved = await options.save(payload)
      reset(saved)
      toast.success(wasNew ? adminCopy.form.created : adminCopy.form.saved)
      if (wasNew && form.value._id) router.replace(options.editRoute(form.value._id))
      return true
    } catch (e) {
      const error = e as ApiError
      toast.error(error.message)
      return false
    } finally {
      saving.value = false
    }
  }

  return { form, errors, loading, saving, failed, isNew, dirty, init, submit, reset }
}
