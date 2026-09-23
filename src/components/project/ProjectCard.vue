<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectCard } from '@/types'
import StageBadge from './StageBadge.vue'
import { useCatalogStore } from '@/stores/catalog'
import { formatPrice, sentenceCase } from '@/utils/format'
import { copy } from '@/config/copy.public'

const props = defineProps<{ project: ProjectCard }>()
const catalog = useCatalogStore()

const title = computed(() => sentenceCase(props.project.title))
const types = computed(() => props.project.propertyTypes.map((t) => catalog.typeLabel(t)).join(', '))
</script>

<template>
  <article class="jcard">
    <RouterLink :to="`/proyectos/${project.slug}`" class="jcard__link">
      <div class="jcard__media">
        <img v-if="project.cover" :src="project.cover" :alt="title" loading="lazy" />
        <div v-else class="jcard__placeholder"><i class="fa-regular fa-building"></i></div>
        <StageBadge :stage="project.stage" class="jcard__badge" />
      </div>
      <div class="jcard__body">
        <p v-if="types" class="jcard__types">{{ types }}</p>
        <h3 class="jcard__title">{{ title }}</h3>
        <p class="jcard__place">
          <i class="fa-solid fa-location-dot"></i> {{ catalog.sectorLabel(project.sector) }} · {{ copy.common.city }}
        </p>
        <p v-if="project.summary" class="jcard__summary">{{ project.summary }}</p>
        <div class="jcard__foot">
          <p class="jcard__price">
            <template v-if="project.priceFrom">
              <small>{{ copy.common.from }}</small> {{ formatPrice(project.priceFrom) }}
            </template>
            <template v-else>{{ copy.common.priceOnRequest }}</template>
          </p>
          <ul class="jcard__meta">
            <li v-if="project.deliveryDate"><i class="fa-regular fa-calendar"></i> {{ project.deliveryDate }}</li>
            <li v-if="project.unitsAvailable > 0">
              <i class="fa-solid fa-key"></i> {{ copy.project.unitsAvailable(project.unitsAvailable) }}
            </li>
          </ul>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
.jcard {
  @include card;
  overflow: hidden;
  @include transition;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);

    img {
      transform: scale(1.03);
    }
  }

  &__link {
    @include flex(column, stretch, flex-start);
    height: 100%;
  }

  &__media {
    position: relative;
    aspect-ratio: 16 / 11;
    overflow: hidden;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s $ease;
    }
  }

  &__placeholder {
    @include flex(row, center, center);
    height: 100%;
    color: $ink-muted;
    font-size: 1.8rem;
  }

  &__badge {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.35rem);
    flex: 1;
    padding: 1rem 1.1rem 1.15rem;
  }

  &__types {
    font-size: $text-xs;
    font-weight: 600;
    color: $brand-blue;
  }

  &__title {
    @include display($text-lg, 600);
    line-height: 1.2;
  }

  &__place {
    font-size: $text-sm;
    color: $ink-muted;

    i {
      color: $brand-orange;
      font-size: 0.8em;
      margin-right: 0.2rem;
    }
  }

  &__summary {
    font-size: $text-sm;
    color: $ink-soft;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__foot {
    margin-top: auto;
    padding-top: 0.8rem;
    border-top: 1px solid $line;
    @include flex(column, stretch, flex-start, 0.4rem);
  }

  &__price {
    @include display($text-lg, 700);
    letter-spacing: -0.01em;

    small {
      font-family: $font-principal;
      font-size: $text-xs;
      font-weight: 500;
      color: $ink-muted;
      letter-spacing: 0;
    }
  }

  &__meta {
    list-style: none;
    @include flex(row, center, flex-start, 0.3rem 1rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $ink-muted;
      font-size: 0.85em;
      margin-right: 0.25rem;
    }
  }
}
</style>
