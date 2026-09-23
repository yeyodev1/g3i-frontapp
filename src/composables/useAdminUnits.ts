import { computed, ref, type Ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { useAdminConfirm } from './useAdminConfirm'
import { adminCopy } from '@/config/copy.admin'
import type { ApiError, Project, Unit } from '@/types'
import type { UnitForm } from '@/types/admin'
import type { FormErrors } from './useAdminEditor'

export function emptyUnit(order = 0): UnitForm {
  return {
    name: '',
    type: 'departamento',
    floor: '',
    bedrooms: null,
    bathrooms: null,
    parking: null,
    storageRooms: null,
    builtM2: null,
    balconyM2: null,
    terraceM2: null,
    gardenM2: null,
    price: 0,
    description: '',
    floorPlan: null,
    images: [],
    status: 'available',
    order,
  }
}

const unitToast: Record<Unit['status'], string> = {
  available: 'Unidad disponible otra vez.',
  reserved: 'Unidad reservada: sigue visible con la etiqueta "Reservada".',
  sold: 'Unidad vendida: ya no aparece en el sitio.',
}

/** Inventario de un proyecto: tabla, modal de alta/edición y estado rápido. */
export function useAdminUnits(projectId: () => string) {
  const toast = useToastStore()
  const { confirm } = useAdminConfirm()

  const project = ref<Project | null>(null)
  const units = ref([]) as Ref<Unit[]>
  const loading = ref(false)
  const saving = ref(false)
  const modalOpen = ref(false)
  const editing = ref(emptyUnit()) as Ref<UnitForm>
  const errors = ref<FormErrors>({})

  const sorted = computed(() => [...units.value].sort((a, b) => a.order - b.order))

  async function refreshProject() {
    project.value = await adminService.getProject(projectId())
  }

  async function load() {
    loading.value = true
    try {
      const [p, list] = await Promise.all([adminService.getProject(projectId()), adminService.listUnits(projectId())])
      project.value = p
      units.value = list
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  function openNew() {
    const last = units.value.length ? Math.max(...units.value.map((u) => u.order)) + 1 : 0
    editing.value = emptyUnit(last)
    errors.value = {}
    modalOpen.value = true
  }

  function openEdit(unit: Unit) {
    const { project: _p, ...rest } = JSON.parse(JSON.stringify(unit)) as Unit
    void _p
    editing.value = { ...emptyUnit(), ...rest }
    errors.value = {}
    modalOpen.value = true
  }

  function validate(form: UnitForm): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Ponle un nombre, por ejemplo "Unidad 402".'
    if (!(form.price > 0)) e.price = 'Escribe el precio de la unidad.'
    return e
  }

  async function save() {
    errors.value = validate(editing.value)
    if (Object.keys(errors.value).length) return toast.error(adminCopy.form.fixErrors)
    saving.value = true
    try {
      await adminService.saveUnit(projectId(), editing.value)
      modalOpen.value = false
      toast.success(adminCopy.form.saved)
      units.value = await adminService.listUnits(projectId())
      await refreshProject()
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  async function setStatus(unit: Unit, status: Unit['status']) {
    try {
      await adminService.setUnitStatus(unit._id, status)
      units.value = units.value.map((u) => (u._id === unit._id ? { ...u, status } : u))
      toast.success(unitToast[status])
      await refreshProject()
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  async function remove(unit: Unit) {
    const ok = await confirm({
      title: '¿Eliminar la unidad?',
      message: `"${unit.name}". ${adminCopy.delete.generic} Si se vendió, mejor márcala como vendida.`,
      confirmLabel: adminCopy.delete.confirm,
      danger: true,
    })
    if (!ok) return
    try {
      await adminService.deleteUnit(unit._id)
      units.value = units.value.filter((u) => u._id !== unit._id)
      toast.success(adminCopy.delete.done)
      await refreshProject()
    } catch (e) {
      toast.error((e as ApiError).message)
    }
  }

  async function move(unit: Unit, direction: -1 | 1) {
    const list = sorted.value
    const from = list.findIndex((u) => u._id === unit._id)
    const to = from + direction
    if (to < 0 || to >= list.length) return
    const next = [...list]
    next.splice(to, 0, ...next.splice(from, 1))
    const changed = next.filter((u, i) => u.order !== i)
    units.value = next.map((u, i) => ({ ...u, order: i }))
    try {
      await Promise.all(changed.map((u) => adminService.saveUnit(projectId(), { ...u, order: next.indexOf(u) })))
    } catch (e) {
      toast.error((e as ApiError).message)
      await load()
    }
  }

  return { project, units, sorted, loading, saving, modalOpen, editing, errors, load, openNew, openEdit, save, setStatus, remove, move }
}
