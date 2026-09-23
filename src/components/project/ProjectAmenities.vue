<script setup lang="ts">
import type { Project } from '@/types'
import ProjectBlockHead from './ProjectBlockHead.vue'
import { useCatalogStore } from '@/stores/catalog'
import { copyProjects } from '@/config/copy.projects'

// Banda azul marino a sangre con las amenidades en celdas separadas por líneas finas.
defineProps<{ project: Project }>()
const catalog = useCatalogStore()
</script>

<template>
  <div class="amen">
    <div class="amen__inner">
      <div class="amen__intro">
        <ProjectBlockHead :eyebrow="copyProjects.amenitiesEyebrow" :title="copyProjects.amenitiesTitle" light class="amen__head" />
        <p v-if="project.amenities.length" class="amen__text">{{ copyProjects.amenitiesText(project.amenities.length) }}</p>
      </div>

      <ul v-if="project.amenities.length" class="amen__grid">
        <li v-for="key in project.amenities" :key="key" class="amen__cell">
          <i :class="catalog.amenity(key).icon" aria-hidden="true"></i>
          <span>{{ catalog.amenity(key).label }}</span>
        </li>
      </ul>

      <div v-if="project.highlights.length" class="amen__highlights">
        <h3>{{ copyProjects.highlightsTitle }}</h3>
        <ul>
          <li v-for="h in project.highlights" :key="h">{{ h }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.amen {
  background: $inverse;
  color: $on-inverse;
  padding-block: 4.5rem;

  @include from('lg') {
    padding-block: 7rem;
  }

  &__inner {
    @include container;
  }

  &__intro {
    @include flex(column, stretch, flex-start, 1.25rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      gap: 4rem;
    }
  }

  &__head {
    @include from('lg') {
      flex: 0 0 36%;
    }
  }

  &__text {
    font-weight: 300;
    line-height: 1.7;
    color: $on-inverse-muted;
  }

  // Líneas de 1px entre celdas: el fondo del contenedor asoma por el gap.
  &__grid {
    list-style: none;
    @include flex(row, stretch, flex-start, 1px);
    flex-wrap: wrap;
    margin-top: 2.5rem;
    background: rgba($on-inverse, 0.14);
    border: 1px solid rgba($on-inverse, 0.14);

    @include from('lg') {
      margin-top: 3.5rem;
    }
  }

  &__cell {
    @include flex(column, flex-start, flex-start, 0.9rem);
    flex: 1 1 calc(50% - 1px);
    min-width: 0;
    padding: 1.5rem 1.25rem;
    background: $inverse;
    font-size: 0.95rem;
    font-weight: 300;

    @include from('md') {
      flex-basis: 180px;
      padding: 1.75rem 1.5rem;
    }

    i {
      font-size: 1.35rem;
      color: $ember-300;
    }
  }

  &__highlights {
    margin-top: 3rem;

    h3 {
      @include caps(0.6875rem, 0.28em);
      color: $ember-300;
    }

    ul {
      list-style: none;
      @include flex(row, stretch, flex-start, 0 2.5rem);
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    li {
      @include flex(row, center, flex-start, 0.9rem);
      flex: 1 1 260px;
      padding-block: 0.8rem;
      border-bottom: 1px solid rgba($on-inverse, 0.14);
      font-weight: 300;

      &::before {
        content: '';
        flex-shrink: 0;
        width: 14px;
        height: 1px;
        background: $ember-300;
      }
    }
  }
}
</style>
