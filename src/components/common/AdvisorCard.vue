<script setup lang="ts">
import { computed } from 'vue'
import type { Advisor } from '@/types'
import { copyPages } from '@/config/copy.pages'

const props = defineProps<{ advisor: Advisor }>()

// Los celulares se guardan como "0995…": para wa.me va con código de país.
const waHref = computed(() => {
  const digits = props.advisor.phone.replace(/\D/g, '')
  if (!digits) return ''
  const intl = digits.startsWith('593') ? digits : `593${digits.replace(/^0/, '')}`
  return `https://wa.me/${intl}`
})
// Sin foto: inicial en Cormorant sobre gris suave, como el retrato del ejemplo.
const initials = computed(() =>
  props.advisor.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join(''),
)
</script>

<template>
  <article class="advisor">
    <div class="advisor__photo">
      <img v-if="advisor.photo" :src="advisor.photo.url" :alt="advisor.name" loading="lazy" />
      <span v-else class="advisor__initials" aria-hidden="true">{{ initials }}</span>
    </div>
    <div class="advisor__body">
      <h3 class="advisor__name">{{ advisor.name }}</h3>
      <p v-if="advisor.role" class="advisor__role">{{ advisor.role }}</p>
      <p v-if="advisor.bio" class="advisor__bio">{{ advisor.bio }}</p>
      <div v-if="waHref || advisor.email" class="advisor__links">
        <a v-if="waHref" :href="waHref" target="_blank" rel="noopener" :aria-label="copyPages.advisor.whatsapp(advisor.name)">
          <i class="fa-brands fa-whatsapp"></i>
        </a>
        <a v-if="advisor.email" :href="`mailto:${advisor.email}`" :aria-label="copyPages.advisor.email(advisor.name)">
          <i class="fa-regular fa-envelope"></i>
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.advisor {
  @include flex(column, stretch, flex-start);

  &__photo {
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: linear-gradient(180deg, $gray-100 0%, $gray-200 100%);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__initials {
    @include flex(row, center, center);
    height: 100%;
    font: 300 clamp(4rem, 3rem + 3vw, 5.5rem) / 1 $font-display;
    color: $navy-900;
  }

  &__body {
    padding-top: 18px;
  }

  &__name {
    font: 400 1.625rem/1.1 $font-display;
    color: $ink;
  }

  &__role {
    @include caps(0.75rem, 0.14em);
    font-weight: 400;
    color: $ink-muted;
    margin-top: 6px;
  }

  &__bio {
    margin-top: 0.8rem;
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.65;
    color: $ink-body;
  }

  &__links {
    @include flex(row, center, flex-start, 8px);
    margin-top: 14px;

    a {
      @include flex(row, center, center);
      width: 38px;
      height: 38px;
      border: 1px solid $line;
      color: $ink;
      @include transition;

      &:hover {
        border-color: $navy-900;
        background: $navy-900;
        color: $surface;
      }
    }
  }
}
</style>
