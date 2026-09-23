import { adminContentService } from '@/services/adminContent.service'
import { useAdminEditor, type FormErrors } from './useAdminEditor'
import type { PostForm } from '@/types/admin'

function emptyPost(): PostForm {
  return { title: '', excerpt: '', cover: null, content: '', status: 'draft' }
}

function validate(form: PostForm): FormErrors {
  const errors: FormErrors = {}
  if (form.title.trim().length < 5) errors.title = 'Escribe un título de al menos 5 letras.'
  if (form.status === 'published' && !form.content.trim()) {
    errors.content = 'Para publicarla, escribe el contenido.'
  }
  return errors
}

export function useAdminPostForm() {
  return useAdminEditor({
    empty: emptyPost,
    fetch: (id) => adminContentService.getPost(id),
    save: (form) => adminContentService.savePost(form),
    validate,
    beforeSave: (form) => ({ ...form, title: form.title.trim() }),
    editRoute: (id) => ({ name: 'AdminPostEdit', params: { id } }),
  })
}
