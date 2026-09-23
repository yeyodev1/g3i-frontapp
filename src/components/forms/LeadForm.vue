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
          {{ sending ? copy.form.sending : copy.form.send }}
        </button>
        <p class="lead__privacy">{{ copy.form.privacy }}</p>
      </form>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.lead {
  @include card;
  padding: 1.5rem 1.25rem;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 2rem;
  }

  &--bare {
    border: none;
    box-shadow: none;
    padding: 0;
  }

  &__head {
    margin-bottom: 1.2rem;
    padding-left: 0.9rem;
    border-left: 2px solid $brand-orange;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__text {
    margin-top: 0.3rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__form {
    @include flex(column, stretch, flex-start, 0.9rem);
  }

  &__row {
    @include flex-cards(200px, 0.9rem);
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
    margin-top: 0.2rem;
  }

  &__privacy {
    font-size: $text-xs;
    color: $ink-muted;
    text-align: center;
  }

  &__done {
    @include flex(column, center, center, 0.5rem);
    text-align: center;
    padding: 1.5rem 0.5rem;

    strong {
      @include display($text-lg, 600);
    }

    p {
      color: $ink-soft;
      font-size: $text-sm;
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
    font-size: $text-sm;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
