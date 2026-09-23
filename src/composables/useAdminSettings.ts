import { computed, ref, type Ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Settings } from '@/types'

export function emptySettings(): Settings {
  return {
    hero: { title: '', subtitle: '', image: null, ctaLabel: '', ctaLink: '' },
    popularSearches: [],
    about: { title: '', text: '', image: null },
    stats: [],
    contact: { whatsapp: '', phone: '', email: '', instagram: '', facebook: '', address: '' },
    sellCta: { title: '', text: '' },
  }
}

/** Mezcla lo que venga del API sobre los valores vacíos, sección por sección. */
function normalize(data: Partial<Settings> | null | undefined): Settings {
  const base = emptySettings()
  const d = data ?? {}
  return JSON.parse(
    JSON.stringify({
      hero: { ...base.hero, ...d.hero },
      popularSearches: (d.popularSearches ?? []).map((p) => ({ label: p.label, query: { ...p.query } })),
      about: { ...base.about, ...d.about },
      stats: d.stats ?? [],
      contact: { ...base.contact, ...d.contact },
      sellCta: { ...base.sellCta, ...d.sellCta },
    }),
  )
}

export function useAdminSettings() {
  const toast = useToastStore()
  const form = ref(emptySettings()) as Ref<Settings>
  const snapshot = ref(JSON.stringify(form.value))
  const loading = ref(true)
  const saving = ref(false)
  const dirty = computed(() => JSON.stringify(form.value) !== snapshot.value)

  function reset(data: Settings) {
    form.value = normalize(data)
    snapshot.value = JSON.stringify(form.value)
  }

  async function load() {
    loading.value = true
    try {
      reset(await adminService.getSettings())
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  async function save() {
    const payload = normalize(form.value)
    // Filtros vacíos fuera: el sitio arma el enlace con lo que quede.
    payload.popularSearches = payload.popularSearches
      .filter((p) => p.label.trim())
      .map((p) => ({
        label: p.label.trim(),
        query: Object.fromEntries(Object.entries(p.query).filter(([, v]) => v)),
      }))
    payload.stats = payload.stats.filter((s) => s.label.trim() && s.value.trim())
    payload.contact.whatsapp = payload.contact.whatsapp.replace(/\D/g, '')

    saving.value = true
    try {
      reset(await adminService.saveSettings(payload))
      toast.success('Ajustes guardados. Ya se ven en el sitio.')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  return { form, loading, saving, dirty, load, save }
}
