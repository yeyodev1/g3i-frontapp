<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import ProjectBlockHead from './ProjectBlockHead.vue'
import LocationMap from '@/components/common/LocationMap.vue'
import { useCatalogStore } from '@/stores/catalog'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

const props = defineProps<{ project: Project }>()
const catalog = useCatalogStore()

const sector = computed(() => catalog.sectorLabel(props.project.sector))
const label = computed(() => `${sector.value} · ${props.project.city || copy.common.city}`)
</script>

<template>
  <div class="ploc">
    <div class="ploc__copy">
      <ProjectBlockHead :eyebrow="copyProjects.locationEyebrow" :title="project.locality || sector" />
      <p class="ploc__text">{{ copyProjects.locationText(sector, Boolean(project.location.exact)) }}</p>
      <p v-if="project.address" class="ploc__address">
        <span aria-hidden="true"></span>{{ project.address }}
      </p>
    </div>
    <div class="ploc__map">
      <LocationMap :location="project.location" :label="label" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ploc {
  @include flex(column, stretch, flex-start, 2rem);

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 3.5rem;
  }

  &__copy {
    @include from('lg') {
      flex: 0 0 34%;
    }
  }

  &__text {
    margin-top: 1.25rem;
    font-weight: 300;
    line-height: 1.7;
    color: $ink-body;
  }

  &__address {
    @include flex(row, center, flex-start, 0.9rem);
    margin-top: 1.5rem;
    padding-block: 0.8rem;
    border-block: 1px solid $line;
    font-weight: 300;
    color: $ink;

    span {
      flex-shrink: 0;
      width: 14px;
      height: 1px;
      background: $blue-700;
    }
  }

  &__map {
    flex: 1;
    min-width: 0;
  }
}
</style>
