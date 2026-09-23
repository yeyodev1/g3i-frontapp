<script setup lang="ts">
import { computed } from 'vue'
import type { Advisor } from '@/types'

const props = defineProps<{ advisor: Advisor }>()

// Los celulares se guardan como "0995…": para wa.me va con código de país.
const waHref = computed(() => {
  const digits = props.advisor.phone.replace(/\D/g, '')
  if (!digits) return ''
  const intl = digits.startsWith('593') ? digits : `593${digits.replace(/^0/, '')}`
  return `https://wa.me/${intl}`
})
const initials = computed(() =>
  props.advisor.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join(''),
)
</script>

<template>
  <article class="advisor">
    <div class="advisor__photo">
      <img v-if="advisor.photo" :src="advisor.photo.url" :alt="advisor.name" loading="lazy" />
      <span v-else class="advisor__initials">{{ initials }}</span>
    </div>
    <div class="advisor__body">
      <h3 class="advisor__name">{{ advisor.name }}</h3>
      <p v-if="advisor.role" class="advisor__role">{{ advisor.role }}</p>
      <p v-if="advisor.bio" class="advisor__bio">{{ advisor.bio }}</p>
      <div v-if="waHref || advisor.email" class="advisor__links">
        <a v-if="waHref" :href="waHref" target="_blank" rel="noopener" :aria-label="`WhatsApp de ${advisor.name}`">
          <i class="fa-brands fa-whatsapp"></i>
        </a>
        <a v-if="advisor.email" :href="`mailto:${advisor.email}`" :aria-label="`Correo de ${advisor.name}`">
          <i class="fa-regular fa-envelope"></i>
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.advisor {
  @include flex(column, stretch, flex-start, 1rem);

  &__photo {
    aspect-ratio: 4 / 5;
    border-radius: 14px;
    overflow: hidden;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__initials {
    @include flex(row, center, center);
    height: 100%;
    @include display($display-sm, 600);
    color: $ink-muted;
  }

  &__name {
    @include display($text-lg, 600);
  }

  &__role {
    font-size: $text-sm;
    color: $brand-blue;
    font-weight: 500;
    margin-top: 0.15rem;
  }

  &__bio {
    margin-top: 0.6rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__links {
    @include flex(row, center, flex-start, 0.5rem);
    margin-top: 0.9rem;

    a {
      @include flex(row, center, center);
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
      border: 1px solid $line;
      color: $ink;
      @include transition;

      &:hover {
        border-color: $ink;
      }
    }
  }
}
</style>
