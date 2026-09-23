<script setup lang="ts">
import type { Settings } from '@/types'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'

const props = defineProps<{ form: Settings }>()

function add() {
  props.form.stats.push({ label: '', value: '' })
}
</script>

<template>
  <AdminSection id="vender" title="Invitación a vender" text='El bloque que invita a dejar una propiedad para la venta.'>
    <AdminField label="Título" for-id="s-title">
      <input id="s-title" v-model="form.sellCta.title" maxlength="120" />
    </AdminField>
    <AdminField label="Texto" for-id="s-text">
      <textarea id="s-text" v-model="form.sellCta.text" rows="3" maxlength="400"></textarea>
    </AdminField>
  </AdminSection>

  <AdminSection
    id="cifras"
    title="Cifras (opcional)"
    text='Ej. "+15 años" · "de experiencia". Si lo dejas vacío, el sitio muestra los conteos reales de propiedades y proyectos.'
  >
    <ul v-if="form.stats.length" class="stats">
      <li v-for="(stat, i) in form.stats" :key="i" class="stats__row">
        <input v-model="stat.value" placeholder="Cifra, ej. +15" aria-label="Cifra" />
        <input v-model="stat.label" placeholder="Texto, ej. años de experiencia" aria-label="Texto" />
        <button type="button" aria-label="Quitar" @click="form.stats.splice(i, 1)"><i class="fa-solid fa-xmark"></i></button>
      </li>
    </ul>
    <button type="button" class="btn btn--ghost add" @click="add"><i class="fa-solid fa-plus"></i> Agregar cifra</button>
  </AdminSection>
</template>

<style scoped lang="scss">
.stats {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.5rem);

  &__row {
    @include flex(row, center, flex-start, 0.4rem);

    input:first-child {
      flex: 0 0 34%;
    }

    button {
      flex: none;
      width: 42px;
      height: 42px;
      color: $danger;
      border: 1px solid $line;
      border-radius: $radius-sm;
    }
  }
}

.add {
  align-self: flex-start;
}
</style>
