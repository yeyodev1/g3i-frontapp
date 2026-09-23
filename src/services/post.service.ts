import APIBase from './httpBase'
import { toQuery } from '@/utils/query'
import type { Paginated, Post, PostCard } from '@/types'

class PostService extends APIBase {
  async list(page = 1, limit = 12): Promise<Paginated<PostCard>> {
    const { data } = await this.get<Paginated<PostCard>>(`posts${toQuery({ page, limit })}`)
    return data
  }

  async getBySlug(slug: string): Promise<Post> {
    const { data } = await this.get<Post>(`posts/${encodeURIComponent(slug)}`)
    return data
  }
}

export const postService = new PostService()
