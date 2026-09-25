<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import StageBadge from './StageBadge.vue'
import { useCatalogStore } from '@/stores/catalog'
import { formatPrice } from '@/utils/format'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

// Portada de la ficha: el primer render a sangre con el titular y los datos clave encima.
const props = defineProps<{ project: Project; title: string }>()
const emit = defineEmits<{ request: [] }>()
const catalog = useCatalogStore()
const f = copyProjects.fact

const cover = computed(() => props.project.images[0])
const facts = computed(() => {
  const p = props.project
  const out = [
    {
      label: f.sector,
      value: [catalog.sectorLabel(p.sector), p.locality].filter(Boolean).join(' · '),
    },
  ]
  out.push({
    label: f.from,
    value: p.priceFrom ? formatPrice(p.priceFrom) : copy.common.priceOnRequest,
  })
  if (p.propertyTypes.length)
    out.push({ label: f.sells, value: p.propertyTypes.map((k) => catalog.typeLabel(k)).join(', ') })
  if (p.deliveryDate) out.push({ label: f.delivery, value: p.deliveryDate })
  return out
})
</script>

<template>
  <header class="intro" :class="{ 'intro--plain': !cover }">
    <img
      v-if="cover"
      :src="cover.url"
      :alt="cover.alt || title"
      class="intro__img"
      fetchpriority="high"
    />
    <div class="intro__scrim" aria-hidden="true"></div>

    <div class="intro__content">
      <RouterLink to="/proyectos" class="intro__back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copyProjects.back }}
      </RouterLink>
      <StageBadge :stage="project.stage" tone="line" class="intro__stage" />
      <h1 class="intro__title">{{ title }}</h1>

      <div class="intro__facts">
        <dl v-for="item in facts" :key="item.label" class="intro__fact">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </dl>
        <button type="button" class="btn btn--primary intro__cta" @click="emit('request')">
          {{ copyProjects.requestInfo }}
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.intro {
  position: relative;
  @include flex(column, stretch, flex-end);
  min-height: 620px;
  overflow: hidden;
  background: $inverse-deep;
  color: $on-inverse;

  @include from('lg') {
    // Más baja que la pantalla: al abrir ya se asoma la barra de secciones.
    min-height: min(640px, calc(100svh - 93px - 4rem));
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__scrim {
    position: absolute;
    inset: 0;
    // Doble degradado: abajo para los datos y a la izquierda para el titular, sea cual sea la foto.
    background:
      linear-gradient(
        180deg,
        rgba($navy-950, 0.45) 0%,
        rgba($navy-950, 0.1) 28%,
        rgba($navy-950, 0.92) 100%
      ),
      linear-gradient(90deg, rgba($navy-950, 0.55) 0%, rgba($navy-950, 0) 70%);
  }

  &--plain &__scrim {
    background: linear-gradient(160deg, $navy-900, $navy-950);
  }

  &__content {
    position: relative;
    @include container;
    padding-block: 5rem 2.5rem;

    @include from('lg') {
      padding-bottom: 3.5rem;
    }
  }

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    display: inline-flex;
    @include caps(0.75rem, 0.2em);
    color: rgba($on-inverse, 0.82);
    @include transition(color);

    i {
      font-size: 0.7rem;
    }

    &:hover {
      color: $on-inverse;
    }
  }

  &__stage {
    display: flex;
    margin-top: 1.6rem;
  }

  &__title {
    @include display(clamp(2.2rem, 1.4rem + 2.6vw, 3.75rem), 300);
    line-height: 1;
    letter-spacing: -0.015em;
    max-width: 20ch;
    margin-top: 0.9rem;
    color: $on-inverse;
    text-shadow: 0 1px 24px rgba($navy-950, 0.35);
  }

  &__facts {
    @include flex(row, flex-end, flex-start, 1.25rem 2rem);
    flex-wrap: wrap;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba($on-inverse, 0.28);

    @include from('lg') {
      flex-wrap: nowrap;
      margin-top: 2rem;
      padding-top: 1.4rem;
    }
  }

  &__fact {
    flex: 1 1 40%;
    min-width: 0;

    @include from('lg') {
      flex: 1 1 0;
    }

    dt {
      @include caps(0.6875rem, 0.22em);
      color: rgba($on-inverse, 0.72);
    }

    dd {
      font-family: $font-display;
      font-size: clamp(1.1rem, 1rem + 0.4vw, 1.4rem);
      line-height: 1.25;
      margin-top: 0.4rem;
    }
  }

  &__cta {
    flex: 1 1 100%;

    @include from('lg') {
      flex: 0 0 auto;
    }
  }
}
</style>
