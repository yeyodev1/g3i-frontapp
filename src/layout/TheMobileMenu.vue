<script setup lang="ts">
import { computed } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { copy } from '@/config/copy.public'
import { useCatalogStore } from '@/stores/catalog'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const catalog = useCatalogStore()
const contact = computed(() => catalog.contact)

const links = computed(() => {
  const counts = catalog.site?.counts
  const countFor: Record<string, number | undefined> = {
    '/propiedades': counts?.properties,
    '/proyectos': counts?.projects,
  }
  // Contacto ya viene en site.nav; se agrega solo si algún día sale de ahí.
  const nav = site.nav.some((l) => l.to === '/contacto')
    ? [...site.nav]
    : [...site.nav, { label: copy.nav.contact, to: '/contacto' }]
  return nav.map((link) => ({
    ...link,
    hint: copy.nav.hints[link.to] ?? '',
    count: countFor[link.to] || 0,
  }))
})
</script>

<template>
  <!-- Teleport al body: el backdrop-filter del header volvería "fixed" relativo al header
       y el menú quedaría recortado en vez de cubrir toda la pantalla. -->
  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="open"
        class="menu"
        role="dialog"
        aria-modal="true"
        :aria-label="copy.nav.menuEyebrow"
      >
        <div class="menu__top">
          <RouterLink to="/" class="menu__logo" :aria-label="site.name">
            <img :src="site.logo" :alt="site.name" width="66" height="44" />
          </RouterLink>
          <button
            class="menu__close"
            type="button"
            :aria-label="copy.nav.closeMenu"
            @click="emit('close')"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        <div class="menu__body">
          <p class="menu__eyebrow">{{ copy.nav.menuEyebrow }}</p>

          <nav id="mobile-menu" class="menu__nav" aria-label="Menú móvil">
            <RouterLink
              v-for="(link, i) in links"
              :key="link.to"
              :to="link.to"
              class="menu__link"
              :style="{ '--i': i }"
              :exact-active-class="link.to === '/' ? 'is-active' : ''"
              :active-class="link.to === '/' ? '' : 'is-active'"
            >
              <span class="menu__label">
                {{ link.label }}
                <sup v-if="link.count" class="menu__count">{{ link.count }}</sup>
              </span>
              <span v-if="link.hint" class="menu__hint">{{ link.hint }}</span>
              <i class="fa-solid fa-arrow-right menu__arrow" aria-hidden="true"></i>
            </RouterLink>
          </nav>

          <div class="menu__foot" :style="{ '--i': links.length }">
            <a class="menu__wa" :href="whatsappLink()" target="_blank" rel="noopener">
              <i class="fa-brands fa-whatsapp"></i> {{ copy.nav.menuWhatsapp }}
            </a>
            <div class="menu__contact">
              <span v-if="contact.email" class="menu__email">{{ contact.email }}</span>
              <div class="menu__social" :aria-label="copy.nav.menuFollow">
                <a
                  v-if="contact.instagram"
                  :href="contact.instagram"
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                >
                  <i class="fa-brands fa-instagram"></i>
                </a>
                <a
                  v-if="contact.facebook"
                  :href="contact.facebook"
                  target="_blank"
                  rel="noopener"
                  aria-label="Facebook"
                >
                  <i class="fa-brands fa-facebook-f"></i>
                </a>
              </div>
            </div>
            <RouterLink :to="site.sellLink.to" class="menu__sell">{{
              site.sellLink.label
            }}</RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss" src="./TheMobileMenu.scss"></style>
