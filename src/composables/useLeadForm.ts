import { reactive, ref } from 'vue'
import { leadService } from '@/services/lead.service'
import { copy } from '@/config/copy.public'
import type { ApiError, LeadInput, LeadKind } from '@/types'

type LeadRefs = Pick<LeadInput, 'property' | 'project' | 'unit' | 'refCode'>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Estado y envío de cualquier formulario de contacto. El honeypot `website`
 * queda en el estado: un bot lo llena, un humano nunca lo ve.
 */
export function useLeadForm(kind: LeadKind, initialMessage = '') {
  const form = reactive({
    kind,
    name: '',
    email: '',
    phone: '',
    message: initialMessage,
    sellSector: '',
    sellPropertyType: '',
    website: '',
  })
  const sending = ref(false)
  const sent = ref(false)
  const error = ref('')

  function validate(): string {
    if (!form.name.trim() || !form.phone.trim()) return copy.form.required
    if (form.email && !EMAIL_RE.test(form.email.trim())) return copy.form.invalidEmail
    if (form.kind === 'sell' && (!form.sellSector || !form.sellPropertyType)) return copy.form.sellRequired
    return ''
  }

  async function submit(refs: LeadRefs = {}) {
    error.value = validate()
    if (error.value) return
    sending.value = true
    try {
      const payload: LeadInput = {
        kind: form.kind,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        message: form.message.trim() || undefined,
        website: form.website,
        ...refs,
      }
      if (form.kind === 'sell') {
        payload.sellSector = form.sellSector
        payload.sellPropertyType = form.sellPropertyType
      }
      await leadService.create(payload)
      sent.value = true
    } catch (e) {
      error.value = (e as ApiError)?.message || copy.common.error
    } finally {
      sending.value = false
    }
  }

  function reset(message = initialMessage) {
    Object.assign(form, { name: '', email: '', phone: '', message, sellSector: '', sellPropertyType: '' })
    sent.value = false
    error.value = ''
  }

  return { form, sending, sent, error, submit, reset }
}
