<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '@/utils/format'
import type { Unit } from '@/types'
import AdminStatusBadge from '../AdminStatusBadge.vue'

const props = defineProps<{ unit: Unit; first: boolean; last: boolean }>()
const emit = defineEmits<{
  edit: []
  remove: []
  status: [status: Unit['status']]
  move: [direction: -1 | 1]
}>()

const specs = computed(() => {
  const u = props.unit
  return [
    u.floor && `Piso ${u.floor}`,
    u.bedrooms && `${u.bedrooms} dorm.`,
    u.bathrooms && `${u.bathrooms} baños`,
    u.parking && `${u.parking} parq.`,
    u.builtM2 && `${u.builtM2} m²`,
  ]
    .filter(Boolean)
    .join(' · ')
})

const statusButtons: { key: Unit['status']; label: string; icon: string }[] = [
  { key: 'available', label: 'Disponible', icon: 'fa-solid fa-circle-check' },
  { key: 'reserved', label: 'Reservada', icon: 'fa-solid fa-clock' },
  { key: 'sold', label: 'Vendida', icon: 'fa-solid fa-handshake' },
]
</script>

<template>
  <article class="unit" :class="{ 'unit--sold': unit.status === 'sold' }">
    <div class="unit__order">
      <button :disabled="first" aria-label="Subir" @click="emit('move', -1)"><i class="fa-solid fa-chevron-up"></i></button>
      <button :disabled="last" aria-label="Bajar" @click="emit('move', 1)"><i class="fa-solid fa-chevron-down"></i></button>
    </div>
    <button class="unit__info" @click="emit('edit')">
      <span class="unit__name">{{ unit.name }} <AdminStatusBadge :status="unit.status" group="unit" /></span>
      <span class="unit__specs">{{ specs || 'Sin detalles' }}</span>
      <strong class="unit__price">{{ formatMoney(unit.price) }}</strong>
    </button>
    <div class="unit__actions">
      <button
        v-for="s in statusButtons"
        :key="s.key"
        :class="{ 'is-current': unit.status === s.key }"
        :aria-pressed="unit.status === s.key"
        @click="unit.status !== s.key && emit('status', s.key)"
      >
        <i :class="s.icon"></i> {{ s.label }}
      </button>
      <button @click="emit('edit')"><i class="fa-solid fa-pen"></i> Editar</button>
      <button class="is-danger" aria-label="Eliminar" @click="emit('remove')"><i class="fa-solid fa-trash"></i></button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.unit {
  @include card;
  @include flex(row, stretch, flex-start, 0.6rem);
  flex-wrap: wrap;
  padding: 0.8rem;

  &--sold {
    background: $sand;

    .unit__name,
    .unit__price {
      color: $ink-muted;
    }
  }

  &__order {
    @include flex(column, center, center, 0.2rem);

    button {
      width: 34px;
      height: 30px;
      border-radius: 8px;
      color: $ink-soft;

      &:disabled {
        opacity: 0.3;
      }

      &:hover {
        background: $sand;
      }
    }
  }

  &__info {
    flex: 1 1 200px;
    @include flex(column, flex-start, center, 0.2rem);
    text-align: left;
    min-width: 0;
  }

  &__name {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-weight: 700;
  }

  &__specs {
    font-size: 0.82rem;
    color: $ink-soft;
  }

  &__price {
    font-size: 0.95rem;
  }

  &__actions {
    flex: 1 1 100%;
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;

    @include from('lg') {
      flex: 0 1 auto;
      justify-content: flex-end;
    }

    button {
      @include flex(row, center, center, 0.35rem);
      min-height: 40px;
      padding: 0.4rem 0.75rem;
      border: 1px solid $line;
      border-radius: $radius-pill;
      font-size: 0.78rem;
      font-weight: 600;
      background: $surface;

      &:hover {
        border-color: $ink;
      }
    }

    .is-current {
      background: $ink;
      border-color: $ink;
      color: $surface;
      cursor: default;
    }

    .is-danger {
      color: $danger;
    }
  }
}
</style>
