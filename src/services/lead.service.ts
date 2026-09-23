import APIBase from './httpBase'
import type { LeadInput } from '@/types'

class LeadService extends APIBase {
  async create(input: LeadInput): Promise<{ ok: boolean }> {
    const { data } = await this.post<{ ok: boolean }>('leads', {
      ...input,
      sourceUrl: input.sourceUrl || window.location.href,
    })
    return data
  }
}

export const leadService = new LeadService()
