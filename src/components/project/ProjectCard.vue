<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectCard } from '@/types'
import StageBadge from './StageBadge.vue'
import { useCatalogStore } from '@/stores/catalog'
import { formatPrice, sentenceCase } from '@/utils/format'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

// overlay: foto con el texto encima (bloque "Otros proyectos" de la ficha).
const props = defineProps<{ project: ProjectCard; overlay?: boolean }>()
const catalog = useCatalogStore()

const title = computed(() => sentenceCase(props.project.title))
const place = computed(() =>
  [catalog.sectorLabel(props.project.sector), props.project.locality].filter(Boolean).join(' · '),
)
const types = computed(() => props.project.propertyTypes.map((t) => catalog.typeLabel(t)).join(', '))
const price = computed(() =>
  props.project.priceFrom ? `${copy.common.from} ${formatPrice(props.project.priceFrom)}` : copy.common.priceOnRequest,
)
</script>

<template>
  <article class="jcard" :class="{ 'jcard--overlay': overlay }">
    <RouterLink :to="`/proyectos/${project.slug}`" class="jcard__link">
      <div class="jcard__media">
        <img v-if="project.cover" :src="project.cover" :alt="title" loading="lazy" />
        <div v-else class="jcard__placeholder"><i class="fa-regular fa-building" aria-hidden="true"></i></div>
        <StageBadge v-if="!overlay" :stage="project.stage" class="jcard__badge" />
        <div v-if="overlay" class="jcard__scrim">
          <p class="jcard__over-meta">{{ catalog.sectorLabel(project.sector) }} · {{ price }}</p>
          <h3 class="jcard__over-title">{{ title }}</h3>
        </div>
      </div>

      <div v-if="!overlay" class="jcard__body">
        <div class="jcard__text">
          <p class="jcard__place">{{ place }}</p>
          <h3 class="jcard__title">{{ title }}</h3>
          <p v-if="types || project.deliveryDate" class="jcard__meta">
            <span v-if="types">{{ types }}</span>
            <span v-if="project.deliveryDate">{{ copyProjects.deliveryShort }} {{ project.deliveryDate }}</span>
          </p>
        </div>
        <div class="jcard__foot">
          <div>
            <p class="jcard__price">{{ price }}</p>
            <p v-if="project.unitsAvailable > 0" class="jcard__units">
              {{ copy.project.unitsAvailable(project.unitsAvailable) }}
            </p>
          </div>
          <span class="jcard__cta">{{ copyProjects.seeProject }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
.jcard {
  @include card;
  overflow: hidden;
  @include transition(box-shadow);

  &:hover {
    box-shadow: $shadow-md;

    img {
      transform: scale(1.04);
    }

    .jcard__cta i {
      transform: translateX(3px);
    }
  }

  &__link {
    @include flex(column, stretch, flex-start);
    height: 100%;
    @include focus-ring;
  }

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: $gray-200;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s $ease;
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
    top: 1rem;
    left: 1rem;
  }

  &__body {
    @include flex(column, stretch, flex-start);
    flex: 1;
    padding: 1.4rem 1.4rem 1.3rem;

    @include from('md') {
      padding: 1.5rem 1.5rem 1.4rem;
    }
  }

  &__place {
    @include eyebrow;
  }

  &__title {
    @include display(1.6rem, 400);
    line-height: 1.15;
    color: $ink;
    margin-top: 0.6rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.25rem 1rem);
    flex-wrap: wrap;
    margin-top: 0.9rem;
    font-size: $text-sm;
    font-weight: 300;
    color: $ink-soft;

    span + span {
      padding-left: 1rem;
      border-left: 1px solid $line;
    }
  }

  &__foot {
    @include flex(row, flex-end, space-between, 1rem);
    margin-top: auto;
    padding-top: 1.1rem;
    border-top: 1px solid $line;
  }

  &__text {
    padding-bottom: 1.2rem;
  }

  &__price {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.1;
    color: $navy-900;
  }

  &__units {
    margin-top: 0.3rem;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__cta {
    @include flex(row, center, flex-start, 0.45rem);
    flex-shrink: 0;
    @include caps(0.6875rem, 0.2em);
    color: $navy-900;
    padding-bottom: 0.2rem;

    i {
      font-size: 0.7rem;
      color: $ember-500;
      transition: transform 0.3s $ease;
    }
  }

  // Variante sobre foto: sin borde y con el texto en el degradado.
  &--overlay {
    border: 0;

    .jcard__media {
      aspect-ratio: auto;
      height: 300px;

      @include from('md') {
        height: 360px;
      }
    }
  }

  &__scrim {
    position: absolute;
    inset: 0;
    @include flex(column, stretch, flex-end, 0.35rem);
    padding: 1.4rem 1.5rem;
    background: linear-gradient(180deg, rgba($navy-950, 0) 35%, rgba($navy-950, 0.86) 100%);
    color: $on-inverse;
  }

  &__over-meta {
    @include caps(0.6875rem, 0.22em);
    opacity: 0.85;
  }

  &__over-title {
    @include display(1.9rem, 300);
    color: $on-inverse;
    line-height: 1.1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
