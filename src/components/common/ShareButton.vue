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
      :data-tip="compact ? site.detail.shareCta : undefined"
      @click="share(props.title, props.text)"
    >
      <i class="fa-solid fa-arrow-up-from-bracket"></i>
      <span v-if="!compact">{{ site.detail.shareCta }}</span>
    </button>
    <Transition name="fade">
      <div v-if="menuOpen" class="share__menu" role="menu">
        <a
          :href="whatsappShareUrl(props.title)"
          target="_blank"
          rel="noopener"
          role="menuitem"
          @click="menuOpen = false"
        >
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
    height: 2.75rem;
    padding-inline: 1.1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    @include caps(0.72rem, 0.18em);
    color: $navy-900;
    background: $surface;
    @include transition;

    i {
      color: $ember-500;
      font-size: 0.85rem;
    }

    &:hover {
      border-color: $navy-900;
    }

    &--compact {
      position: relative;
      width: 2.75rem;
      padding: 0;

      // Solo ícono: al pasar el cursor aparece «Compartir» (pedido de la clienta).
      &::after {
        content: attr(data-tip);
        position: absolute;
        top: calc(100% + 0.45rem);
        left: 50%;
        z-index: 21;
        padding: 0.35rem 0.6rem;
        background: $navy-900;
        color: $on-inverse;
        @include caps(0.625rem, 0.16em);
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transform: translate(-50%, -4px);
        transition:
          opacity 0.2s ease,
          transform 0.2s ease;
      }

      &:hover::after,
      &:focus-visible::after {
        opacity: 1;
        transform: translate(-50%, 0);
      }

      // Con el menú abierto el tooltip estorbaría.
      &[aria-expanded='true']::after {
        opacity: 0;
      }
    }
  }

  &__menu {
    position: absolute;
    right: 0;
    top: calc(100% + 0.4rem);
    z-index: 20;
    min-width: 13rem;
    @include card;
    box-shadow: $shadow-lg;
    padding: 0.4rem;
    @include flex(column, stretch, flex-start, 0.1rem);

    a,
    button {
      @include flex(row, center, flex-start, 0.6rem);
      padding: 0.6rem 0.75rem;
      border-radius: $radius-sm;
      font-size: $text-sm;
      text-align: left;
      color: $ink;

      &:hover {
        background: $gray-100;
      }
    }
  }
}
</style>
