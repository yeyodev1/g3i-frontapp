<script setup lang="ts">
import { computed, onMounted } from 'vue'
import FieldInput from './FieldInput.vue'
import FieldSelect from './FieldSelect.vue'
import { useLeadForm } from '@/composables/useLeadForm'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import type { LeadKind } from '@/types'

const catalog = useCatalogStore()
const { form, sending, sent, error, submit, reset } = useLeadForm('sell')

// Catálogo completo (no solo los activos): quien vende puede estar en un sector sin publicaciones.
const sectorOptions = computed(() => [
  ...catalog.allSectors,
  { key: 'otro', label: copy.form.otherSector },
])
const isSell = computed(() => form.kind === 'sell')

function choose(kind: string) {
  form.kind = kind as LeadKind
}

onMounted(() => catalog.ensureCatalogs())
</script>

<template>
  <div class="sell-form">
    <Transition name="fade" mode="out-in">
      <div v-if="sent" class="sell-form__done" role="status">
        <span class="sell-form__done-icon"><i class="fa-solid fa-check"></i></span>
        <h2>{{ copy.form.successTitle }}</h2>
        <p>{{ site.sell.success }}</p>
        <button type="button" class="btn btn--ghost" @click="reset()">{{ copy.form.sendAnother }}</button>
      </div>

      <form v-else class="sell-form__form" novalidate @submit.prevent="submit()">
        <fieldset class="sell-form__interest">
          <legend>{{ copy.form.interest }}</legend>
          <div class="sell-form__options">
            <label
              v-for="opt in site.sell.interests"
              :key="opt.key"
              class="sell-form__option"
              :class="{ 'is-checked': form.kind === opt.key }"
            >
              <input type="radio" name="interest" :value="opt.key" :checked="form.kind === opt.key" @change="choose(opt.key)" />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </fieldset>

        <FieldInput v-model="form.name" :label="copy.form.name" autocomplete="name" required />
        <div class="sell-form__row">
          <FieldInput v-model="form.phone" :label="copy.form.phone" type="tel" inputmode="tel" autocomplete="tel" required />
          <FieldInput v-model="form.email" :label="copy.form.email" type="email" inputmode="email" autocomplete="email" />
        </div>

        <Transition name="rise">
          <div v-if="isSell" class="sell-form__row">
            <FieldSelect
              v-model="form.sellSector"
              :label="copy.form.sellSector"
              :options="sectorOptions"
              :placeholder="copy.form.sellSectorPlaceholder"
              required
            />
            <FieldSelect
              v-model="form.sellPropertyType"
              :label="copy.form.sellType"
              :options="site.sell.sellPropertyTypes"
              :placeholder="copy.form.sellTypePlaceholder"
              required
            />
          </div>
        </Transition>

        <FieldInput v-model="form.message" :label="copy.form.messageOptional" multiline :rows="4" />

        <div class="sell-form__hp" aria-hidden="true">
          <label>Website <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" /></label>
        </div>

        <p v-if="error" class="sell-form__error" role="alert"><i class="fa-solid fa-circle-exclamation"></i> {{ error }}</p>
        <button type="submit" class="btn btn--primary sell-form__submit" :disabled="sending">
          <i v-if="sending" class="fa-solid fa-circle-notch fa-spin"></i>
          {{ sending ? copy.form.sending : copy.form.send }}
        </button>
        <p class="sell-form__privacy">{{ copy.form.privacy }}</p>
      </form>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.sell-form {
  &__form {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__interest {
    border: none;

    legend {
      font-size: 0.82rem;
      font-weight: 500;
      color: $ink-soft;
      margin-bottom: 0.5rem;
    }
  }

  &__options {
    @include flex(row, stretch, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__option {
    flex: 1 1 150px;
    margin: 0;
    cursor: pointer;
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0.75rem 0.9rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    font-size: $text-sm;
    color: $ink;
    @include transition;

    input {
      width: auto;
      accent-color: $ink;
    }

    &.is-checked {
      border-color: $ink;
      box-shadow: inset 0 0 0 1px $ink;
    }

    &:hover {
      border-color: $ink-muted;
    }
  }

  &__row {
    @include flex-cards(200px, 1rem);
  }

  &__hp {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
  }

  &__submit {
    width: 100%;

    @include from('md') {
      width: auto;
      align-self: flex-start;
    }
  }

  &__privacy {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__done {
    @include flex(column, center, center, 0.7rem);
    text-align: center;
    padding: 2rem 0.5rem;

    h2 {
      @include display($text-xl, 600);
    }

    p {
      color: $ink-soft;
      max-width: 40ch;
    }
  }

  &__done-icon {
    @include flex(row, center, center);
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    border: 1px solid $success;
    color: $success;
  }
}
</style>
