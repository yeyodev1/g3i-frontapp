<script setup lang="ts">
import type { Project } from '@/types'
import StageBadge from './StageBadge.vue'
import ShareButton from '@/components/common/ShareButton.vue'
import { useCatalogStore } from '@/stores/catalog'
import { formatPrice } from '@/utils/format'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'

defineProps<{ project: Project; title: string }>()
const catalog = useCatalogStore()
</script>

<template>
  <header class="intro">
    <nav class="intro__crumbs" aria-label="Migas de pan">
      <RouterLink to="/proyectos">{{ site.listing.projectsTitle }}</RouterLink>
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      <span>{{ catalog.sectorLabel(project.sector) }}</span>
    </nav>
    <div class="intro__row">
      <div class="intro__copy">
        <StageBadge :stage="project.stage" class="intro__badge" />
        <h1 class="intro__title">{{ title }}</h1>
        <p class="intro__place">
          <i class="fa-solid fa-location-dot"></i> {{ catalog.sectorLabel(project.sector) }} · {{ project.city || copy.common.city }}
          <span v-if="project.code" class="intro__code">· {{ copy.property.code }} {{ project.code }}</span>
        </p>
      </div>
      <div class="intro__side">
        <p class="intro__price">
          <template v-if="project.priceFrom">
            <small>{{ copy.common.from }}</small> {{ formatPrice(project.priceFrom) }}
          </template>
          <template v-else>{{ copy.common.priceOnRequest }}</template>
        </p>
        <ShareButton :title="title" :text="project.summary" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.intro {
  @include container;
  padding-block: 1.5rem 1.25rem;

  &__crumbs {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-xs;
    color: $ink-muted;
    margin-bottom: 1rem;

    i {
      font-size: 0.6rem;
    }

    a:hover {
      color: $ink;
    }
  }

  &__row {
    @include flex(column, flex-start, space-between, 1rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__badge {
    border: 1px solid $line;
    margin-bottom: 0.7rem;
  }

  &__title {
    @include display($display-md, 600);
    max-width: 22ch;
  }

  &__place {
    margin-top: 0.6rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $brand-orange;
      font-size: 0.85em;
    }
  }

  &__code {
    color: $ink-muted;
  }

  &__side {
    @include flex(row, center, flex-start, 1rem);
    flex-wrap: wrap;

    @include from('md') {
      flex-direction: column;
      align-items: flex-end;
    }
  }

  &__price {
    @include display($display-sm, 700);

    small {
      font-family: $font-principal;
      font-size: $text-sm;
      font-weight: 500;
      color: $ink-muted;
      letter-spacing: 0;
    }
  }
}
</style>
