<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import FieldSelect from '@/components/forms/FieldSelect.vue'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copyHome } from '@/config/copy.home'
import type { PopularSearch } from '@/types'

const props = defineProps<{
  title?: string
  subtitle?: string
  image?: string
  popular: PopularSearch[]
}>()

const router = useRouter()
const catalog = useCatalogStore()
const type = ref('')
const sector = ref('')

// Solo sectores con inmuebles publicados: nunca llevar a una búsqueda vacía.
const sectors = computed(() => catalog.activeSectors.map((s) => ({ key: s.key, label: s.label })))
const types = computed(() => catalog.propertyTypes.map((t) => ({ key: t.key, label: t.label })))

function search() {
  const query: Record<string, string> = {}
  if (type.value) query.type = type.value
  if (sector.value) query.sector = sector.value
  router.push({ path: '/propiedades', query })
}
</script>

<template>
  <section class="hero">
    <div class="hero__media" aria-hidden="true">
      <img v-if="props.image" :src="props.image" alt="" fetchpriority="high" />
    </div>
    <div class="hero__inner">
      <div class="hero__copy">
        <h1 class="hero__title">{{ title || site.home.heroTitle }}</h1>
        <p class="hero__subtitle">{{ subtitle || site.home.heroSubtitle }}</p>
      </div>

      <form class="search" role="search" @submit.prevent="search">
        <FieldSelect v-model="type" class="search__field" :label="site.home.searchTypeLabel" :options="types" :placeholder="copyHome.anyType" />
        <FieldSelect v-model="sector" class="search__field" :label="site.home.searchSectorLabel" :options="sectors" :placeholder="copyHome.anySector" />
        <button type="submit" class="btn btn--primary search__btn">
          <i class="fa-solid fa-magnifying-glass"></i> {{ site.home.searchButton }}
        </button>
      </form>

      <div v-if="popular.length" class="popular">
        <span class="popular__label">{{ site.home.popularTitle }}</span>
        <RouterLink
          v-for="item in popular"
          :key="item.label"
          :to="{ path: '/propiedades', query: item.query }"
          class="popular__chip"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  isolation: isolate;
  min-height: min(88vh, 760px);
  @include flex(column, stretch, flex-end);
  background: $ink;
  color: $surface;

  &__media {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(#0b0b0b, 0.35) 0%, rgba(#0b0b0b, 0.25) 35%, rgba(#0b0b0b, 0.78) 100%);
    }
  }

  &__inner {
    @include container(1160px);
    padding-block: 7rem 2.5rem;
  }

  &__copy {
    max-width: 40rem;
    margin-bottom: 1.8rem;
  }

  &__title {
    @include display($display-lg, 600);
    color: $surface;
  }

  &__subtitle {
    margin-top: 1rem;
    font-size: $text-lg;
    color: rgba(#fff, 0.85);
    max-width: 48ch;
  }
}

.search {
  @include flex(column, stretch, flex-start, 0.8rem);
  background: $surface;
  color: $ink;
  border-radius: $radius-md;
  padding: 1rem;
  box-shadow: $shadow-lg;
  max-width: 860px;

  @include from('md') {
    flex-direction: row;
    align-items: flex-end;
    padding: 1.1rem 1.1rem 1.1rem 1.4rem;
  }

  &__field {
    flex: 1 1 0;
  }

  &__btn {
    padding-block: 0.8rem;

    @include from('md') {
      min-width: 9rem;
    }
  }
}

.popular {
  @include flex(row, center, flex-start, 0.5rem);
  flex-wrap: wrap;
  margin-top: 1.3rem;

  &__label {
    font-size: $text-sm;
    color: rgba(#fff, 0.75);
    margin-right: 0.3rem;
  }

  &__chip {
    font-size: $text-sm;
    padding: 0.4rem 0.9rem;
    border-radius: $radius-pill;
    border: 1px solid rgba(#fff, 0.35);
    color: $surface;
    background: rgba(#fff, 0.06);
    backdrop-filter: blur(4px);
    @include transition;

    &:hover {
      background: $surface;
      color: $ink;
    }
  }
}
</style>
