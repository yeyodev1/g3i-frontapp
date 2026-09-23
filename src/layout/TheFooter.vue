<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { useCatalogStore } from '@/stores/catalog'

const catalog = useCatalogStore()
const year = new Date().getFullYear()
const contact = computed(() => catalog.contact)
const waHref = computed(() => (contact.value.whatsapp ? `https://wa.me/${contact.value.whatsapp}` : ''))

onMounted(() => catalog.ensureSite())
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <img :src="site.logo" :alt="site.name" class="footer__logo" width="120" height="44" />
        <p class="footer__text">{{ site.footer.text }}</p>
        <div v-if="contact.instagram || contact.facebook" class="footer__social">
          <a v-if="contact.instagram" :href="contact.instagram" target="_blank" rel="noopener" aria-label="Instagram">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a v-if="contact.facebook" :href="contact.facebook" target="_blank" rel="noopener" aria-label="Facebook">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
        </div>
      </div>

      <nav class="footer__col" aria-label="Pie de página">
        <h2 class="footer__heading">{{ site.shortName }}</h2>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
        <RouterLink to="/preguntas-frecuentes">{{ copy.nav.faq }}</RouterLink>
        <RouterLink to="/contacto">{{ copy.nav.contact }}</RouterLink>
      </nav>

      <div class="footer__col">
        <h2 class="footer__heading">{{ copy.nav.contact }}</h2>
        <a v-if="waHref" :href="waHref" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> {{ contact.phone || contact.whatsapp }}
        </a>
        <a v-if="contact.phone" :href="`tel:${contact.phone}`"><i class="fa-solid fa-phone"></i> {{ contact.phone }}</a>
        <a v-if="contact.email" :href="`mailto:${contact.email}`"><i class="fa-regular fa-envelope"></i> {{ contact.email }}</a>
        <p v-if="contact.address"><i class="fa-solid fa-location-dot"></i> {{ contact.address }}</p>
        <RouterLink :to="site.sellLink.to" class="footer__sell">{{ site.sellLink.label }}</RouterLink>
      </div>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }}. {{ site.footer.rights }}</span>
      <span>Hecho por <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a></span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $sand;
  border-top: 1px solid $line;
  color: $ink-soft;
  margin-top: auto;

  &__inner {
    @include container(1280px);
    @include flex-cards(200px, 2.5rem);
    padding-block: $space-xl 2.5rem;
  }

  &__brand {
    flex: 2 1 260px !important;
  }

  &__logo {
    height: 40px;
    width: auto;
    margin-bottom: 1rem;
  }

  &__text {
    font-size: $text-sm;
    max-width: 36ch;
  }

  &__social {
    @include flex(row, center, flex-start, 0.5rem);
    margin-top: 1.2rem;

    a {
      @include flex(row, center, center);
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
      border: 1px solid $line;
      background: $surface;
      color: $ink;
      @include transition;

      &:hover {
        border-color: $ink;
      }
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;

    a,
    p {
      color: $ink-soft;
      @include transition(color);

      i {
        width: 1.1rem;
        color: $ink-muted;
      }
    }

    a:hover {
      color: $ink;
    }
  }

  &__heading {
    @include eyebrow;
    margin-bottom: 0.3rem;
  }

  &__sell {
    margin-top: 0.6rem;
    font-size: $text-xs;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  &__bar {
    @include container(1280px);
    @include flex(row, center, space-between, 0.6rem 1rem);
    flex-wrap: wrap;
    padding-block: 1.2rem 5.5rem;
    border-top: 1px solid $line;
    font-size: $text-xs;
    color: $ink-muted;

    @include from('md') {
      padding-bottom: 1.2rem;
    }

    a {
      color: $ink-soft;
    }
  }
}
</style>
