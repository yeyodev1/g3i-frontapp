import APIBase from './httpBase'
import type { Faq, SiteData } from '@/types'

class SiteService extends APIBase {
  async getSite(): Promise<SiteData> {
    const { data } = await this.get<SiteData>('site')
    return data
  }

  async getFaqs(): Promise<Faq[]> {
    const { data } = await this.get<Faq[]>('faqs')
    return data
  }
}

export const siteService = new SiteService()
