<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { useBodyScroll } from '@/composables/useBodyScroll'

const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)

useBodyScroll(mobileOpen)

// Al navegar se cierra el menú móvil.
watch(() => route.fullPath, () => (mobileOpen.value = false))

function onScroll() {
  scrolled.value = window.scrollY > 8
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') mobileOpen.value = false
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="site.name">
        <img :src="site.logo" :alt="site.name" width="112" height="40" />
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <RouterLink
          v-for="link in site.nav"
          :key="link.to"
          :to="link.to"
          class="header__link"
          :exact-active-class="link.to === '/' ? 'is-active' : ''"
          :active-class="link.to === '/' ? '' : 'is-active'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <RouterLink :to="site.sellLink.to" class="header__sell">{{ site.sellLink.label }}</RouterLink>

      <button
        class="header__burger"
        type="button"
        :aria-label="mobileOpen ? copy.nav.closeMenu : copy.nav.openMenu"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu"
        @click="mobileOpen = !mobileOpen"
      >
        <i :class="mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>
    </div>

    <Transition name="fade">
      <nav v-if="mobileOpen" id="mobile-menu" class="mobile" aria-label="Menú móvil">
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="mobile__link">
          {{ link.label }}
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
        <RouterLink to="/contacto" class="mobile__link">
          {{ copy.nav.contact }}
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
        <RouterLink :to="site.sellLink.to" class="mobile__sell">{{ site.sellLink.label }}</RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
$header-h: 64px;

.header {
  position: sticky;
  top: 0;
  z-index: 500;
  background: rgba($paper, 0.94);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  @include transition(border-color);

  &--scrolled {
    border-color: $line;
  }

  &__inner {
    @include container(1280px);
    @include flex(row, center, space-between, 1rem);
    height: $header-h;
  }

  &__logo img {
    height: 36px;
    width: auto;
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, center, 1.6rem);
      flex: 1;
    }
  }

  &__link {
    position: relative;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    padding-block: 0.4rem;
    @include transition(color);

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: $brand-blue;
      transform: scaleX(0);
      transition: transform 0.3s $ease;
    }

    &:hover,
    &.is-active {
      color: $ink;
    }

    &.is-active::after {
      transform: scaleX(1);
    }
  }

  // Discreto a propósito: texto pequeño, sin fondo.
  &__sell {
    display: none;
    font-size: $text-xs;
    color: $ink-muted;
    text-decoration: underline;
    text-decoration-color: $line;
    text-underline-offset: 4px;
    @include transition(color);

    &:hover {
      color: $ink;
      text-decoration-color: $brand-orange;
    }

    @include from('lg') {
      display: inline;
    }
  }

  &__burger {
    font-size: 1.25rem;
    color: $ink;
    width: 2.75rem;
    height: 2.75rem;
    @include flex(row, center, center);

    @include from('lg') {
      display: none;
    }
  }
}

.mobile {
  position: fixed;
  inset: $header-h 0 0 0;
  background: $paper;
  padding: 1rem 1.25rem 2rem;
  @include flex(column, stretch, flex-start);
  overflow-y: auto;

  @include from('lg') {
    display: none;
  }

  &__link {
    @include flex(row, center, space-between);
    @include display($text-xl, 600);
    padding-block: 1rem;
    border-bottom: 1px solid $line;
    color: $ink;

    i {
      font-size: 0.8rem;
      color: $ink-muted;
    }

    &.router-link-exact-active i {
      color: $brand-blue;
    }
  }

  &__sell {
    margin-top: 1.5rem;
    font-size: $text-sm;
    color: $ink-muted;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
}
</style>
