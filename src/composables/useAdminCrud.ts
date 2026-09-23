import { computed, ref, type Ref } from 'vue'
import { adminContentService } from '@/services/adminContent.service'
import { useToastStore } from '@/stores/toast'
import { useAdminConfirm } from './useAdminConfirm'
import { adminCopy } from '@/config/copy.admin'
import type { ApiError } from '@/types'
import type { Orderable, SimpleResource } from '@/types/admin'
import type { FormErrors } from './useAdminEditor'

interface CrudOptions<F> {
  empty: () => F
  validate: (form: F) => FormErrors
  /** Nombre del elemento para los mensajes: "la pregunta", "el asesor". */
  noun: string
  describe: (item: F) => string
}

/** Lista + modal para preguntas, asesores, testimonios y socios. */
export function useAdminCrud<T extends Orderable, F extends { _id?: string; order: number }>(
  resource: SimpleResource,
  options: CrudOptions<F>,
) {
  const toast = useToastStore()
  const { confirm } = useAdminConfirm()

  const items = ref([]) as Ref<T[]>
  const loading = ref(false)
  const saving = ref(false)
  const modalOpen = ref(false)
  const editing = ref(options.empty()) as Ref<F>
  const errors = ref<FormErrors>({})

  const sorted = computed(() => [...items.value].sort((a, b) => a.order - b.order))

  async function load() {
    loading.value = true
    try {
      items.value = await adminContentService.list<T>(resource)
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  function openNew() {
    const fresh = options.empty()
    fresh.order = items.value.length ? Math.max(...items.value.map((i) => i.order)) + 1 : 0
    editing.value = fresh
    errors.value = {}
    modalOpen.value = true
  }

  function openEdit(item: T) {
    editing.value = { ...options.empty(), ...JSON.parse(JSON.stringify(item)) }
    errors.value = {}
    modalOpen.value = true
  }

  async function save() {
    errors.value = options.validate(editing.value)
    if (Object.keys(errors.value).length) return toast.error(adminCopy.form.fixErrors)
    saving.value = true
    try {
      await adminContentService.save(resource, editing.value)
      modalOpen.value = false
      toast.success(adminCopy.form.saved)
      await load()
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  async function remove(item: T) {
    const ok = await confirm({
      title: `¿Eliminar ${options.noun}?`,
      message: `"${options.describe(item as unknown as F)}". ${adminCopy.delete.generic}`,
      confirmLabel: adminCopy.delete.confirm,
      danger: true,
    })
    if (!ok) return
    try {
      await adminContentService.remove(resource, item._id)
      items.value = items.value.filter((i) => i._id !== item._id)
      toast.success(adminCopy.delete.done)
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  /** Sube o baja un puesto y guarda solo los que cambiaron de orden. */
  async function move(item: T, direction: -1 | 1) {
    const list = sorted.value
    const from = list.findIndex((i) => i._id === item._id)
    const to = from + direction
    if (to < 0 || to >= list.length) return
    const next = [...list]
    next.splice(to, 0, ...next.splice(from, 1))
    const changed = next
      .map((entry, index) => ({ ...entry, order: index }))
      .filter((entry, index) => list.find((i) => i._id === entry._id)?.order !== index)
    items.value = next.map((entry, index) => ({ ...entry, order: index }))
    try {
      await Promise.all(changed.map((entry) => adminContentService.save(resource, entry)))
    } catch (e) {
      toast.error((e as ApiError).message)
      await load()
    }
  }

  return { items, sorted, loading, saving, modalOpen, editing, errors, load, openNew, openEdit, save, remove, move }
}
