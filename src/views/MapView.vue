<script setup lang="ts">
import { ref } from 'vue'
import MapFilters from '@/components/map/MapFilters.vue'
import MapResults from '@/components/map/MapResults.vue'
import { useMapExplorer } from '@/composables/useMapExplorer'
import { useSeo } from '@/composables/useSeo'
import { copy } from '@/config/copy.public'
import { copyHome } from '@/config/copy.home'

const el = ref<HTMLElement | null>(null)
const { filters, activeCount, update, clear, visible, loading, error, load, focus, stageOptions } =
  useMapExplorer(el)

useSeo({ title: copy.map.title, description: copy.map.description })
</script>

<template>
  <div class="map-view">
    <aside class="map-view__panel">
      <h1 class="map-view__title">{{ copy.map.title }}</h1>
      <MapFilters
        :filters="filters"
        :active-count="activeCount"
        :stage-options="stageOptions"
        class="map-view__filters"
        @update="update"
        @clear="clear"
      />
      <MapResults :pins="visible" :loading="loading" class="map-view__results" @focus="focus" />
    </aside>

    <div class="map-view__stage">
      <div ref="el" class="map-view__map" role="region" :aria-label="copy.map.title"></div>
      <div v-if="error" class="map-view__error" role="alert">
        {{ copyHome.mapError }}
        <button type="button" @click="load">{{ copy.common.retry }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$header-h: 64px;

.map-view {
  position: relative;
  height: calc(100vh - #{$header-h});
  height: calc(100dvh - #{$header-h});
  min-height: 460px;
  @include flex(column, stretch, flex-start);

  @include from('lg') {
    flex-direction: row;
  }

  // Móvil: el panel es una capa sobre el mapa (filtros arriba, tira abajo).
  &__panel {
    display: contents;

    @include from('lg') {
      @include flex(column, stretch, flex-start, 1rem);
      flex: 0 0 400px;
      padding: 1.25rem 1.25rem 0;
      border-right: 1px solid $line;
      background: $paper;
      min-height: 0;
    }
  }

  &__title {
    @include display($text-xl, 600);

    @include until('lg') {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
  }

  &__filters {
    @include until('lg') {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      z-index: 2;
      padding: 0.6rem;
      background: rgba($surface, 0.96);
      border-radius: $radius-md;
      box-shadow: $shadow-md;
    }
  }

  &__results {
    @include until('lg') {
      position: absolute;
      left: 0;
      right: 0;
      // Sobre el botón flotante de WhatsApp, que vive abajo a la derecha.
      bottom: 5rem;
      z-index: 2;
    }

    @include from('lg') {
      flex: 1;
    }
  }

  &__stage {
    position: relative;
    flex: 1;
    min-height: 0;
    isolation: isolate;
  }

  &__map {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: $sand;
  }

  &__error {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    @include card;
    box-shadow: $shadow-md;
    padding: 1rem 1.2rem;
    font-size: $text-sm;
    text-align: center;
    @include flex(column, center, center, 0.5rem);

    button {
      font-weight: 600;
      text-decoration: underline;
    }
  }
}
</style>
