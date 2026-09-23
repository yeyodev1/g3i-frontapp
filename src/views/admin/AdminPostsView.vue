<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminContentService } from '@/services/adminContent.service'
import { useAdminConfirm } from '@/composables/useAdminConfirm'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import type { ApiError, Post } from '@/types'

const toast = useToastStore()
const { confirm } = useAdminConfirm()
const posts = ref<Post[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    posts.value = (await adminContentService.listPosts()).items
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    loading.value = false
  }
}

async function remove(post: Post) {
  const ok = await confirm({
    title: '¿Eliminar la entrada?',
    message: `"${post.title}". ${adminCopy.delete.generic}`,
    confirmLabel: adminCopy.delete.confirm,
    danger: true,
  })
  if (!ok) return
  try {
    await adminContentService.deletePost(post._id)
    posts.value = posts.value.filter((p) => p._id !== post._id)
    toast.success(adminCopy.delete.done)
  } catch (e) {
    toast.error((e as ApiError).message)
  }
}

onMounted(load)
</script>

<template>
  <div>
    <AdminPageHeader title="Blog" subtitle="Artículos y novedades que se publican en el sitio.">
      <RouterLink :to="{ name: 'AdminPostNew' }" class="btn btn--primary">
        <i class="fa-solid fa-plus"></i> Nueva entrada
      </RouterLink>
    </AdminPageHeader>

    <p v-if="loading" class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando…</p>
    <AdminEmpty v-else-if="!posts.length" :text="adminCopy.empty.posts" icon="fa-solid fa-pen-nib">
      <RouterLink :to="{ name: 'AdminPostNew' }" class="btn btn--dark">Escribir la primera</RouterLink>
    </AdminEmpty>

    <div v-else class="posts">
      <article v-for="post in posts" :key="post._id" class="post">
        <RouterLink :to="{ name: 'AdminPostEdit', params: { id: post._id } }" class="post__main">
          <div class="post__thumb">
            <img v-if="post.cover" :src="post.cover.url" alt="" loading="lazy" />
            <i v-else class="fa-regular fa-image"></i>
          </div>
          <div class="post__info">
            <span class="post__status" :class="`post__status--${post.status}`">
              {{ post.status === 'published' ? 'Publicada' : 'Borrador' }}
            </span>
            <h3>{{ post.title }}</h3>
            <p v-if="post.excerpt">{{ post.excerpt }}</p>
          </div>
        </RouterLink>
        <div class="post__actions">
          <RouterLink :to="{ name: 'AdminPostEdit', params: { id: post._id } }"><i class="fa-solid fa-pen"></i> Editar</RouterLink>
          <a v-if="post.status === 'published'" :href="`/blog/${post.slug}`" target="_blank" rel="noopener">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver
          </a>
          <button class="is-danger" @click="remove(post)"><i class="fa-solid fa-trash"></i> Eliminar</button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  color: $ink-soft;
  padding: 2rem 0;
}

.posts {
  @include flex(column, stretch, flex-start, 0.8rem);
}

.post {
  @include card;
  @include flex(row, center, space-between, 0.6rem);
  flex-wrap: wrap;
  padding: 0.9rem;

  &__main {
    @include flex(row, flex-start, flex-start, 0.9rem);
    flex: 1 1 280px;
    min-width: 0;
  }

  &__thumb {
    flex: none;
    width: 96px;
    height: 68px;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $sand;
    @include flex(row, center, center);
    color: $ink-muted;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    min-width: 0;

    h3 {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3;
    }

    p {
      font-size: 0.82rem;
      color: $ink-soft;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__status {
    font-size: 0.72rem;
    font-weight: 600;
    color: darken($warning, 18%);

    &--published {
      color: darken($success, 12%);
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.35rem);

    a,
    button {
      @include flex(row, center, center, 0.35rem);
      min-height: 40px;
      padding: 0.4rem 0.8rem;
      border: 1px solid $line;
      border-radius: $radius-pill;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .is-danger {
      color: $danger;
    }
  }
}
</style>
