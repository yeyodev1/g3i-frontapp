<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { useBodyScroll } from '@/composables/useBodyScroll'
import TheMobileMenu from './TheMobileMenu.vue'

const props = defineProps<{ overlay?: boolean }>()

const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)

useBodyScroll(mobileOpen)

// Transparente solo sobre la portada; al bajar pasa a sólido para que se lea.
const transparent = computed(() => props.overlay && !scrolled.value)
// Sobre fondo oscuro (portada o header navy al hacer scroll) va el logo blanco.
const dark = computed(() => props.overlay)
const logo = computed(() => (dark.value ? site.logoWhite : site.logo))

// Al navegar se cierra el menú móvil.
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    onScroll()
  },
)

function onScroll() {
  scrolled.value = window.scrollY > 24
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') mobileOpen.value = false
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header
    class="header"
    :class="{
      'header--overlay': overlay,
      'header--transparent': transparent,
      'header--dark': dark,
      'header--scrolled': scrolled,
    }"
  >
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="site.name">
        <img :src="logo" :alt="site.name" width="96" height="64" />
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

      <button
        class="header__burger"
        type="button"
        :aria-label="mobileOpen ? copy.nav.closeMenu : copy.nav.openMenu"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span></span>
        <span></span>
      </button>
    </div>

    <TheMobileMenu :open="mobileOpen" @close="mobileOpen = false" />
  </header>
</template>

<style scoped lang="scss" src="./TheHeader.scss"></style>
