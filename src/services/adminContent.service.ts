import APIBase from './httpBase'
import { toPage, toQuery, unwrap } from './admin.service'
import type { Paginated, Post } from '@/types'
import type { PostForm, SimpleResource } from '@/types/admin'

/**
 * Contenido editorial del portal: blog y las listas simples (preguntas,
 * asesores, testimonios, socios), que comparten la misma forma de rutas.
 */
class AdminContentService extends APIBase {
  async listPosts(page = 1): Promise<Paginated<Post>> {
    const { data } = await this.get<unknown>(`admin/posts${toQuery({ page, limit: 50 })}`)
    return toPage<Post>(data, 'posts')
  }

  async getPost(id: string): Promise<Post> {
    const { data } = await this.get<unknown>(`admin/posts/${id}`)
    return unwrap<Post>(data, 'post')
  }

  async savePost(form: PostForm): Promise<Post> {
    const { _id, ...body } = form
    const { data } = _id
      ? await this.put<unknown>(`admin/posts/${_id}`, body)
      : await this.post<unknown>('admin/posts', body)
    return unwrap<Post>(data, 'post')
  }

  async deletePost(id: string): Promise<void> {
    await this.delete(`admin/posts/${id}`)
  }

  async list<T>(resource: SimpleResource): Promise<T[]> {
    const { data } = await this.get<unknown>(`admin/${resource}`)
    return toPage<T>(data, resource).items
  }

  async save<T extends { _id?: string }>(resource: SimpleResource, item: T): Promise<T> {
    const { _id, ...body } = item
    const { data } = _id
      ? await this.put<unknown>(`admin/${resource}/${_id}`, body)
      : await this.post<unknown>(`admin/${resource}`, body)
    return unwrap<T>(data, 'item')
  }

  async remove(resource: SimpleResource, id: string): Promise<void> {
    await this.delete(`admin/${resource}/${id}`)
  }
}

export const adminContentService = new AdminContentService()
