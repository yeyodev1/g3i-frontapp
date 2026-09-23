<script setup lang="ts">
import { toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { adminCopy } from '@/config/copy.admin'

const props = defineProps<{ open: boolean; title: string; saving?: boolean; saveLabel?: string }>()
const emit = defineEmits<{ close: []; save: [] }>()

useBodyScroll(toRef(props, 'open'))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet" @click.self="emit('close')">
        <form class="sheet__box" role="dialog" aria-modal="true" :aria-label="title" @submit.prevent="emit('save')">
          <header class="sheet__head">
            <h2 class="sheet__title">{{ title }}</h2>
            <button type="button" class="sheet__close" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="sheet__body">
            <slot />
          </div>
          <footer class="sheet__foot">
            <button type="button" class="btn btn--ghost" @click="emit('close')">{{ adminCopy.form.cancel }}</button>
            <button type="submit" class="btn btn--primary" :disabled="saving">
              <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>
              {{ saving ? adminCopy.form.saving : saveLabel || adminCopy.form.create }}
            </button>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
// En el celular es una hoja a pantalla completa; en escritorio, un diálogo.
.sheet {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: $overlay;
  @include flex(row, flex-end, center);

  @include from('md') {
    align-items: center;
    padding: 1.5rem;
  }

  &__box {
    background: $surface;
    width: 100%;
    max-height: 100dvh;
    height: 100dvh;
    @include flex(column, stretch, flex-start);

    @include from('md') {
      max-width: 640px;
      height: auto;
      max-height: calc(100dvh - 3rem);
      border-radius: $radius-md;
      box-shadow: $shadow-lg;
    }
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 1rem 1.2rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 700;
  }

  &__close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 1.2rem;

    &:hover {
      background: $sand;
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.2rem;
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__foot {
    @include flex(row, center, flex-end, 0.6rem);
    padding: 0.9rem 1.2rem;
    border-top: 1px solid $line;

    .btn {
      flex: 1;

      @include from('md') {
        flex: none;
      }
    }
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;

  .sheet__box {
    transition: transform 0.3s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__box {
    transform: translateY(24px);
  }
}
</style>
