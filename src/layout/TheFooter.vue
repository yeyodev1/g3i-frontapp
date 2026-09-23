<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { copyHome } from '@/config/copy.home'
import { useCatalogStore } from '@/stores/catalog'

const catalog = useCatalogStore()
const year = new Date().getFullYear()
const contact = computed(() => catalog.contact)
const t = copyHome.footer

// Usuario visible de la red a partir del enlace (…/Grupo3Inversiones/ → Grupo3Inversiones).
function handle(url: string): string {
  return url.replace(/\/+$/, '').split('/').pop() ?? ''
}

const contactLinks = computed(() => {
  const c = contact.value
  return [
    c.whatsapp && {
      icon: 'fa-brands fa-whatsapp',
      // Sin número de teléfono a la vista (pedido de la clienta): solo WhatsApp.
      label: t.whatsapp,
      href: `https://wa.me/${c.whatsapp}`,
    },
    c.email && { icon: 'fa-regular fa-envelope', label: c.email, href: `mailto:${c.email}` },
    c.facebook && { icon: 'fa-brands fa-facebook-f', label: handle(c.facebook), href: c.facebook },
    c.instagram && {
      icon: 'fa-brands fa-instagram',
      label: `@${handle(c.instagram)}`,
      href: c.instagram,
    },
  ].filter(Boolean) as { icon: string; label: string; href: string }[]
})

const sectors = computed(() => catalog.activeSectors.map((s) => s.label).join(' · '))

onMounted(() => {
  catalog.ensureSite()
  catalog.ensureActiveSectors()
})
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo-link" :aria-label="site.name">
          <img
            :src="site.logoWhite"
            :alt="site.name"
            class="footer__logo"
            width="144"
            height="96"
            loading="lazy"
          />
        </RouterLink>
        <p class="footer__slogan">{{ site.slogan }}</p>
      </div>

      <nav class="footer__col" :aria-label="t.properties">
        <h2 class="footer__heading">{{ t.properties }}</h2>
        <RouterLink
          v-for="link in t.propertyLinks"
          :key="link.label"
          :to="link.type ? { path: '/propiedades', query: { type: link.type } } : '/propiedades'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <nav class="footer__col" :aria-label="t.company">
        <h2 class="footer__heading">{{ t.company }}</h2>
        <RouterLink v-for="link in t.companyLinks" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
        <RouterLink :to="site.sellLink.to">{{ site.sellLink.label }}</RouterLink>
      </nav>

      <div class="footer__col">
        <h2 class="footer__heading">{{ t.contact }}</h2>
        <a
          v-for="link in contactLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener"
        >
          <i :class="link.icon" aria-hidden="true"></i> {{ link.label }}
        </a>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="footer__bar">
        <span>
          © {{ year }} {{ site.shortName }} · {{ site.legalName }}
          <span class="footer__credit">
            · {{ t.madeBy }} <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a>
          </span>
        </span>
        <span v-if="sectors" class="footer__sectors">{{ sectors }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss" src="./TheFooter.scss"></style>
