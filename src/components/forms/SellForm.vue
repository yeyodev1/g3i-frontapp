<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import FieldInput from './FieldInput.vue'
import FieldSelect from './FieldSelect.vue'
import { useLeadForm } from '@/composables/useLeadForm'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyPages } from '@/config/copy.pages'
import type { LeadKind } from '@/types'

// Formulario de «Contáctanos»: vender, comprar, trabajar con nosotros u otra consulta.
// compact: versión apretada para que en Contáctanos se vea entera sin hacer scroll.
const props = withDefaults(
  defineProps<{ initialKind?: LeadKind; title?: string; compact?: boolean }>(),
  {
    initialKind: 'sell',
    title: '',
    compact: false,
  },
)
const emit = defineEmits<{ kind: [kind: LeadKind] }>()

const c = copyPages.contact
const catalog = useCatalogStore()
const { form, sending, sent, error, submit, reset } = useLeadForm(props.initialKind)

// Catálogo completo (no solo los activos): quien vende puede estar en un sector sin publicaciones.
const sectorOptions = computed(() => [
  ...catalog.allSectors,
  { key: 'otro', label: copy.form.otherSector },
])
const isSell = computed(() => form.kind === 'sell')

function choose(kind: string) {
  form.kind = kind as LeadKind
  emit('kind', form.kind)
}

watch(
  () => props.initialKind,
  (kind) => (form.kind = kind),
)

onMounted(() => catalog.ensureCatalogs())
</script>

<template>
  <div class="sell-form" :class="{ 'sell-form--compact': compact }">
    <Transition name="fade" mode="out-in">
      <div v-if="sent" class="sell-form__done" role="status">
        <span class="sell-form__done-icon"><i class="fa-solid fa-check"></i></span>
        <h2>{{ copy.form.successTitle }}</h2>
        <p>{{ site.sell.success }}</p>
        <button type="button" class="link-caps" @click="reset()">
          {{ copy.form.sendAnother }}
        </button>
      </div>

      <form v-else class="sell-form__form" novalidate @submit.prevent="submit()">
        <h2 v-if="title" class="sell-form__title">{{ title }}</h2>

        <fieldset class="sell-form__interest">
          <legend>{{ c.interestLabel }}</legend>
          <div class="sell-form__options">
            <label
              v-for="opt in c.interests"
              :key="opt.key"
              class="sell-form__option"
              :class="{ 'is-checked': form.kind === opt.key }"
            >
              <input
                type="radio"
                name="interest"
                class="visually-hidden"
                :value="opt.key"
                :checked="form.kind === opt.key"
                @change="choose(opt.key)"
              />
              <i :class="opt.icon" aria-hidden="true"></i>
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </fieldset>

        <FieldInput v-model="form.name" :label="copy.form.name" autocomplete="name" required />
        <div class="sell-form__row">
          <FieldInput
            v-model="form.email"
            :label="copy.form.email"
            type="email"
            inputmode="email"
            autocomplete="email"
          />
          <FieldInput
            v-model="form.phone"
            :label="copy.form.phone"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            required
          />
        </div>

        <Transition name="rise">
          <div v-if="isSell" class="sell-form__sell">
            <p class="sell-form__hint">{{ c.sellHint }}</p>
            <div class="sell-form__row">
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
          </div>
        </Transition>

        <FieldInput
          v-model="form.message"
          :label="copy.form.messageOptional"
          multiline
          :rows="compact ? 2 : 3"
        />

        <div class="sell-form__hp" aria-hidden="true">
          <label
            >Website
            <input
              v-model="form.website"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
          /></label>
        </div>

        <p v-if="error" class="sell-form__error" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
        </p>
        <div class="sell-form__actions">
          <button type="submit" class="btn btn--dark btn--lg sell-form__submit" :disabled="sending">
            <i v-if="sending" class="fa-solid fa-circle-notch fa-spin"></i>
            {{ sending ? copy.form.sending : copy.form.send }}
            <i v-if="!sending" class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          <p class="sell-form__privacy">{{ copy.form.privacy }}</p>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped lang="scss" src="./SellForm.scss"></style>
