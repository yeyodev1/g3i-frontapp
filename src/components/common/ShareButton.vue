<script setup lang="ts">
import { useShare } from '@/composables/useShare'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'

const props = defineProps<{ title: string; text?: string; compact?: boolean }>()
const { share, copyLink, whatsappShareUrl, menuOpen } = useShare()
</script>

<template>
  <div class="share">
    <button
      type="button"
      class="share__btn"
      :class="{ 'share__btn--compact': compact }"
      :aria-expanded="menuOpen"
      :aria-label="site.detail.shareCta"
      @click="share(props.title, props.text)"
    >
      <i class="fa-solid fa-arrow-up-from-bracket"></i>
      <span v-if="!compact">{{ site.detail.shareCta }}</span>
    </button>
    <Transition name="fade">
      <div v-if="menuOpen" class="share__menu" role="menu">
        <a :href="whatsappShareUrl(props.title)" target="_blank" rel="noopener" role="menuitem" @click="menuOpen = false">
          <i class="fa-brands fa-whatsapp"></i> {{ copy.common.shareWhatsapp }}
        </a>
        <button type="button" role="menuitem" @click="copyLink">
          <i class="fa-regular fa-copy"></i> {{ copy.common.copyLink }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.share {
  position: relative;

  &__btn {
    @include flex(row, center, center, 0.5rem);
    height: 2.6rem;
    padding-inline: 1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    background: $surface;
    @include transition;

    i {
      color: $brand-blue;
    }

    &:hover {
      border-color: $ink;
    }

    &--compact {
      width: 2.6rem;
      padding: 0;
    }
  }

  &__menu {
    position: absolute;
    right: 0;
    top: calc(100% + 0.4rem);
    z-index: 20;
    min-width: 13rem;
    @include card;
    box-shadow: $shadow-md;
    padding: 0.4rem;
    @include flex(column, stretch, flex-start, 0.1rem);

    a,
    button {
      @include flex(row, center, flex-start, 0.6rem);
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      font-size: $text-sm;
      text-align: left;
      color: $ink;

      &:hover {
        background: $sand;
      }
    }
  }
}
</style>
