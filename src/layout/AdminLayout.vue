<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { adminCopy } from '@/config/copy.admin'
import AdminConfirmHost from '@/components/admin/AdminConfirmHost.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const drawer = ref(false)
useBodyScroll(drawer)

watch(
  () => route.fullPath,
  () => (drawer.value = false),
)

// "Inicio" solo se marca en /admin exacto; el resto también en sus subrutas.
function isActive(to: string) {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
}

function logout() {
  userStore.clear()
  toast.info(adminCopy.loggedOut)
  router.replace({ name: 'Login' })
}
</script>

<template>
  <div class="admin">
    <header class="admin__topbar">
      <button class="admin__burger" aria-label="Abrir menú" @click="drawer = true">
        <i class="fa-solid fa-bars"></i>
      </button>
      <RouterLink to="/admin" class="admin__toplogo">
        <img src="/logo-g3i.png" alt="G3i" />
      </RouterLink>
      <a href="/" target="_blank" rel="noopener" class="admin__topsite" :aria-label="adminCopy.viewSite">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    </header>

    <Transition name="fade">
      <div v-if="drawer" class="admin__scrim" @click="drawer = false"></div>
    </Transition>

    <aside class="admin__side" :class="{ 'admin__side--open': drawer }">
      <div class="admin__brand">
        <RouterLink to="/admin" class="admin__logo">
          <img src="/logo-g3i.png" alt="G3i" />
        </RouterLink>
        <button class="admin__close" aria-label="Cerrar menú" @click="drawer = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <p class="admin__label">{{ adminCopy.brand }}</p>

      <nav class="admin__nav">
        <RouterLink
          v-for="item in adminCopy.nav"
          :key="item.to"
          :to="item.to"
          class="admin__link"
          :class="{ 'admin__link--active': isActive(item.to) }"
        >
          <i :class="item.icon"></i> {{ item.label }}
        </RouterLink>
      </nav>

      <div class="admin__foot">
        <a href="/" target="_blank" rel="noopener" class="admin__link">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> {{ adminCopy.viewSite }}
        </a>
        <button class="admin__link admin__link--logout" @click="logout">
          <i class="fa-solid fa-right-from-bracket"></i> {{ adminCopy.logout }}
        </button>
        <p v-if="userStore.user" class="admin__user">{{ userStore.user.email }}</p>
      </div>
    </aside>

    <main class="admin__main">
      <slot />
    </main>

    <AdminConfirmHost />
  </div>
</template>

<style scoped lang="scss">
$side: 256px;

.admin {
  min-height: 100vh;
  background: $sand;

  &__topbar {
    position: sticky;
    top: 0;
    z-index: 40;
    height: 60px;
    @include flex(row, center, space-between, 0.5rem);
    padding-inline: 0.5rem;
    background: $surface;
    border-bottom: 1px solid $line;

    @include from('lg') {
      display: none;
    }
  }

  &__burger,
  &__topsite,
  &__close {
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    border-radius: $radius-sm;
    font-size: 1.15rem;
    color: $ink;
  }

  &__toplogo img {
    height: 34px;
    width: auto;
  }

  &__scrim {
    position: fixed;
    inset: 0;
    z-index: 45;
    background: $overlay;

    @include from('lg') {
      display: none;
    }
  }

  &__side {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 50;
    width: min(84vw, $side);
    background: $surface;
    border-right: 1px solid $line;
    @include flex(column, stretch, flex-start);
    padding: 1rem 0.8rem;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s $ease;

    &--open {
      transform: none;
      box-shadow: $shadow-lg;
    }

    @include from('lg') {
      transform: none;
      width: $side;
    }
  }

  &__brand {
    @include flex(row, center, space-between);
    padding: 0.2rem 0.5rem 0.4rem;
  }

  &__logo img {
    height: 44px;
    width: auto;
  }

  &__close {
    @include from('lg') {
      display: none;
    }
  }

  &__label {
    @include eyebrow;
    font-size: 0.62rem;
    color: $ink-muted;
    padding: 0.4rem 0.7rem 0.8rem;
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.15rem);
    flex: 1;
  }

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    width: 100%;
    min-height: 46px;
    padding: 0.55rem 0.8rem;
    border-radius: $radius-sm;
    font-size: 0.92rem;
    font-weight: 500;
    color: $ink-soft;
    text-align: left;
    @include transition(background);

    i {
      width: 1.2rem;
      text-align: center;
      color: $ink-muted;
    }

    &:hover {
      background: $sand;
      color: $ink;
    }

    &--active {
      background: $ink;
      color: $surface;

      i {
        color: $surface;
      }

      &:hover {
        background: $ink;
        color: $surface;
      }
    }

    &--logout:hover {
      color: $danger;

      i {
        color: $danger;
      }
    }
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.15rem);
    border-top: 1px solid $line;
    padding-top: 0.8rem;
    margin-top: 1rem;
  }

  &__user {
    font-size: 0.75rem;
    color: $ink-muted;
    padding: 0.5rem 0.8rem 0;
    overflow-wrap: anywhere;
  }

  &__main {
    padding: 1.2rem 1rem 2.5rem;
    min-width: 0;

    @include from('md') {
      padding: 2rem 2rem 3rem;
    }

    @include from('lg') {
      margin-left: $side;
      padding: 2.2rem 2.5rem 3rem;
    }
  }
}
</style>
