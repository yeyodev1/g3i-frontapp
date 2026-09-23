<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyHome } from '@/config/copy.home'

const catalog = useCatalogStore()
const text = computed(() => catalog.site?.settings.sellCta.text || copy.home.sellText)
</script>

<template>
  <!-- Discreto a propósito: una línea, sin bloque de color. -->
  <aside class="sell">
    <p class="sell__inner">
      <i class="fa-regular fa-handshake" aria-hidden="true"></i>
      <span>{{ text }}</span>
      <RouterLink :to="site.sellLink.to" class="sell__link">{{ copyHome.sellLink }}</RouterLink>
    </p>
  </aside>
</template>

<style scoped lang="scss">
.sell {
  border-top: 1px solid $line;

  &__inner {
    @include container;
    @include flex(row, center, center, 0.4rem 0.7rem);
    flex-wrap: wrap;
    text-align: center;
    padding-block: 2rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $brand-orange;
    }
  }

  &__link {
    color: $ink;
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: $brand-blue;
    text-underline-offset: 4px;
  }
}
</style>
