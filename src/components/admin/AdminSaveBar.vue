<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'

defineProps<{ dirty: boolean; saving: boolean; isNew?: boolean }>()
const emit = defineEmits<{ save: [] }>()
</script>

<template>
  <div class="savebar">
    <p class="savebar__state" :class="{ 'savebar__state--dirty': dirty }">
      <i :class="dirty ? 'fa-solid fa-circle' : 'fa-solid fa-circle-check'"></i>
      {{ dirty ? adminCopy.form.unsavedBar : 'Todo guardado' }}
    </p>
    <div class="savebar__actions">
      <slot />
      <button type="button" class="btn btn--primary savebar__save" :disabled="saving" @click="emit('save')">
        <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"></i>
        {{ saving ? adminCopy.form.saving : isNew ? adminCopy.form.create : adminCopy.form.save }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.savebar {
  position: sticky;
  bottom: 0;
  z-index: 20;
  @include flex(row, center, space-between, 0.8rem);
  flex-wrap: wrap;
  background: rgba($surface, 0.96);
  backdrop-filter: blur(6px);
  border-top: 1px solid $line;
  padding: 0.8rem 1rem;
  margin-inline: -1rem;
  margin-top: 1.5rem;

  @include from('md') {
    margin-inline: 0;
    border: 1px solid $line;
    border-radius: $radius-md;
    box-shadow: $shadow-md;
    bottom: 1rem;
  }

  &__state {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: 0.82rem;
    color: $ink-muted;

    i {
      font-size: 0.6rem;
      color: $success;
    }

    &--dirty {
      color: $ink;
      font-weight: 600;

      i {
        color: $brand-orange;
      }
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.5rem);
    flex: 1 1 auto;
    flex-wrap: wrap;
  }

  &__save {
    flex: 1 1 180px;

    @include from('md') {
      flex: none;
    }
  }
}
</style>
