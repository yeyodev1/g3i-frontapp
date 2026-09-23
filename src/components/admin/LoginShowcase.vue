<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { useCatalogStore } from '@/stores/catalog'
import { propertyService } from '@/services/property.service'

const catalog = useCatalogStore()
const fallbackCover = ref('')

// La misma foto de portada del sitio; si no hay, la de la primera propiedad destacada.
const image = computed(() => catalog.site?.settings.hero.image?.url || fallbackCover.value)
const counts = computed(() => catalog.site?.counts)

onMounted(async () => {
  await catalog.ensureSite().catch(() => undefined)
  if (catalog.site?.settings.hero.image?.url) return
  try {
    const { items } = await propertyService.list({ featured: true, limit: 1 })
    fallbackCover.value = items[0]?.cover ?? ''
  } catch {
    // Sin foto el panel queda en grafito liso: sigue viéndose bien.
  }
})
</script>

<template>
  <aside class="show" aria-hidden="true">
    <Transition name="fade">
      <img v-if="image" :key="image" :src="image" alt="" class="show__img" />
    </Transition>
    <div class="show__shade"></div>

    <div class="show__content">
      <img src="/logo-g3i.png" alt="" class="show__logo" />
      <div class="show__copy">
        <p class="show__eyebrow">{{ adminCopy.login.showcaseEyebrow }}</p>
        <p class="show__title">{{ adminCopy.login.showcaseTitle }}</p>
        <p class="show__text">{{ adminCopy.login.showcaseText }}</p>
      </div>
      <div v-if="counts" class="show__stats">
        <div>
          <b>{{ counts.properties }}</b>
          <span>{{ adminCopy.login.statProperties }}</span>
        </div>
        <div>
          <b>{{ counts.projects }}</b>
          <span>{{ adminCopy.login.statProjects }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.show {
  position: relative;
  overflow: hidden;
  background: #121314;
  color: #f4f4f2;
  min-height: 34vh;
  @include flex(column, stretch, flex-end);

  @include from('lg') {
    min-height: 100vh;
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: drift 24s ease-in-out infinite alternate;
  }

  &__shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(#121314, 0.35) 0%, rgba(#121314, 0.2) 35%, rgba(#121314, 0.92) 100%),
      linear-gradient(90deg, rgba(#121314, 0.5), transparent 60%);
  }

  &__content {
    position: relative;
    @include flex(column, flex-start, flex-end, 1.25rem);
    padding: 1.25rem 1.25rem 4.5rem;
    flex: 1;

    @include from('lg') {
      justify-content: space-between;
      padding: 2.5rem 3rem 3rem;
    }
  }

  &__logo {
    height: 44px;
    width: auto;
    background: #f4f4f2;
    border-radius: 10px;
    padding: 0.35rem 0.6rem;
    box-sizing: content-box;

    @include until('lg') {
      position: absolute;
      top: 1.25rem;
      left: 1.25rem;
      height: 30px;
    }
  }

  &__copy {
    display: none;
    max-width: 30rem;

    @include from('lg') {
      @include flex(column, flex-start, flex-start, 0.9rem);
    }
  }

  &__eyebrow {
    @include flex(row, center, flex-start, 0.6rem);
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(#f4f4f2, 0.7);

    &::before {
      content: '';
      width: 1.6rem;
      height: 2px;
      border-radius: 2px;
      background: $brand-orange;
    }
  }

  &__title {
    @include display(clamp(2.2rem, 1.4rem + 2vw, 3.3rem), 700);
    letter-spacing: -0.03em;
  }

  &__text {
    font-size: $text-lg;
    color: rgba(#f4f4f2, 0.75);
  }

  &__stats {
    display: none;
    gap: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(#f4f4f2, 0.18);

    @include from('lg') {
      display: flex;
    }

    div {
      @include flex(column, flex-start, flex-start, 0.1rem);
    }

    b {
      font-family: $font-display;
      font-size: 2.2rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }

    span {
      font-size: $text-sm;
      color: rgba(#f4f4f2, 0.65);
    }
  }
}

@keyframes drift {
  from {
    transform: scale(1.04);
  }
  to {
    transform: scale(1.12) translateX(-1.5%);
  }
}
</style>
