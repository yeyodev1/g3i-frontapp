<script setup lang="ts">
import { watch } from 'vue'
import FieldInput from './FieldInput.vue'
import { useLeadForm } from '@/composables/useLeadForm'
import { copy } from '@/config/copy.public'
import { site } from '@/config/site'
import type { LeadInput, LeadKind } from '@/types'

const props = withDefaults(
  defineProps<{
    kind: LeadKind
    title?: string
    text?: string
    message?: string
    refs?: Pick<LeadInput, 'property' | 'project' | 'unit' | 'refCode'>
    bare?: boolean
    /** Texto del botón; por defecto «Enviar». */
    submitLabel?: string
  }>(),
  { title: site.detail.contactTitle, text: site.detail.contactText, message: '' },
)

const { form, sending, sent, error, submit, reset } = useLeadForm(props.kind, props.message)

// El mensaje prellenado llega después del fetch de la ficha; si la persona
// ya escribió algo propio, no se lo pisamos.
watch(
  () => props.message,
  (value, old) => {
    if (!form.message || form.message === old) form.message = value
  },
)
</script>

<template>
  <section class="lead" :class="{ 'lead--bare': bare }">
    <header v-if="title" class="lead__head">
      <h2 class="lead__title">{{ title }}</h2>
      <p v-if="text" class="lead__text">{{ text }}</p>
    </header>

    <Transition name="fade" mode="out-in">
      <div v-if="sent" class="lead__done" role="status">
        <span class="lead__done-icon"><i class="fa-solid fa-check"></i></span>
        <strong>{{ copy.form.successTitle }}</strong>
        <p>{{ copy.form.success }}</p>
        <button type="button" class="lead__again" @click="reset(props.message)">{{ copy.form.sendAnother }}</button>
      </div>

      <form v-else class="lead__form" novalidate @submit.prevent="submit(props.refs)">
        <FieldInput v-model="form.name" :label="copy.form.name" autocomplete="name" required />
        <div class="lead__row">
          <FieldInput v-model="form.phone" :label="copy.form.phone" type="tel" inputmode="tel" autocomplete="tel" required />
          <FieldInput v-model="form.email" :label="copy.form.email" type="email" inputmode="email" autocomplete="email" />
        </div>
        <FieldInput v-model="form.message" :label="copy.form.message" multiline :rows="4" />
        <!-- Honeypot: invisible para personas, tentador para bots -->
        <div class="lead__hp" aria-hidden="true">
          <label>Website <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" /></label>
        </div>
        <p v-if="error" class="lead__error" role="alert"><i class="fa-solid fa-circle-exclamation"></i> {{ error }}</p>
        <button type="submit" class="btn btn--primary lead__submit" :disabled="sending">
          <i v-if="sending" class="fa-solid fa-circle-notch fa-spin"></i>
          {{ sending ? copy.form.sending : submitLabel || copy.form.send }}
        </button>
        <p class="lead__privacy">{{ copy.form.privacy }}</p>
      </form>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.lead {
  @include card;
  padding: 1.75rem 1.25rem;
  box-shadow: $shadow-md;

  @include from('md') {
    padding: 2.25rem;
  }

  &--bare {
    border: none;
    box-shadow: none;
    padding: 0;
    background: transparent;
  }

  &__head {
    margin-bottom: 1.5rem;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.375rem;
    font-weight: 400;
    line-height: 1.35;
    color: $ink;
  }

  &__text {
    margin-top: 0.4rem;
    font-size: $text-sm;
    font-weight: 300;
    color: $ink-soft;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1.375rem);
  }

  &__row {
    @include flex-cards(200px, 1.375rem);
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
    border-radius: $radius-sm;
  }

  &__submit {
    width: 100%;
    margin-top: 0.6rem;
  }

  &__privacy {
    font-size: $text-xs;
    font-weight: 300;
    color: $ink-muted;
    text-align: center;
  }

  &__done {
    @include flex(column, center, center, 0.5rem);
    text-align: center;
    padding: 1.5rem 0.5rem;

    strong {
      font-family: $font-display;
      font-size: 1.5rem;
      font-weight: 400;
    }

    p {
      color: $ink-soft;
      font-size: $text-sm;
      font-weight: 300;
    }
  }

  &__done-icon {
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 1px solid $success;
    color: $success;
    margin-bottom: 0.4rem;
  }

  &__again {
    margin-top: 0.4rem;
    @include caps(0.6875rem, 0.22em);
    color: $navy-900;
    padding-bottom: 0.2rem;
    border-bottom: 1px solid currentColor;

    &:hover {
      color: $ember-600;
    }
  }
}
</style>
