<script setup lang="ts">
import type { Unit } from '@/types'
import UnitStatusBadge from './UnitStatusBadge.vue'
import { useCatalogStore } from '@/stores/catalog'
import { formatM2, formatNumber, formatPrice } from '@/utils/format'
import { copy } from '@/config/copy.public'

const props = defineProps<{ units: Unit[]; slug: string }>()
const catalog = useCatalogStore()
const h = copy.project.unitHeaders

const to = (u: Unit) => `/proyectos/${props.slug}/unidades/${u._id}`
const num = (n: number | null) => (n && n > 0 ? formatNumber(n) : '–')
</script>

<template>
  <div class="inventory">
    <!-- Escritorio: tabla real, cada fila enlaza a su unidad -->
    <table class="inventory__table">
      <thead>
        <tr>
          <th scope="col">{{ h.name }}</th>
          <th scope="col">{{ h.type }}</th>
          <th scope="col" class="num">{{ h.bedrooms }}</th>
          <th scope="col" class="num">{{ h.bathrooms }}</th>
          <th scope="col" class="num">{{ h.parking }}</th>
          <th scope="col" class="num">{{ h.area }}</th>
          <th scope="col" class="num">{{ h.price }}</th>
          <th scope="col">{{ h.status }}</th>
          <th scope="col"><span class="visually-hidden">{{ copy.project.seeUnit }}</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in units" :key="u._id" :class="{ 'is-reserved': u.status === 'reserved' }">
          <th scope="row">
            <RouterLink :to="to(u)" class="inventory__name">{{ u.name }}</RouterLink>
            <small v-if="u.floor">{{ copy.specs.floor }} {{ u.floor }}</small>
          </th>
          <td>{{ catalog.typeLabel(u.type) }}</td>
          <td class="num">{{ num(u.bedrooms) }}</td>
          <td class="num">{{ num(u.bathrooms) }}</td>
          <td class="num">{{ num(u.parking) }}</td>
          <td class="num">{{ formatM2(u.builtM2) || '–' }}</td>
          <td class="num price">{{ formatPrice(u.price) }}</td>
          <td><UnitStatusBadge :status="u.status" /></td>
          <td class="go">
            <RouterLink :to="to(u)" :aria-label="`${copy.project.seeUnit} ${u.name}`">
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Móvil: tarjetas -->
    <ul class="inventory__cards">
      <li v-for="u in units" :key="u._id">
        <RouterLink :to="to(u)" class="ucard">
          <div class="ucard__top">
            <p class="ucard__type">
              {{ catalog.typeLabel(u.type) }}<template v-if="u.floor"> · {{ copy.specs.floor }} {{ u.floor }}</template>
            </p>
            <UnitStatusBadge :status="u.status" />
          </div>
          <strong class="ucard__name">{{ u.name }}</strong>
          <ul class="ucard__specs">
            <li v-if="u.bedrooms"><i class="fa-solid fa-bed" aria-hidden="true"></i> {{ u.bedrooms }} {{ copy.specs.bedroomsShort }}</li>
            <li v-if="u.bathrooms"><i class="fa-solid fa-bath" aria-hidden="true"></i> {{ formatNumber(u.bathrooms) }} {{ copy.specs.bathroomsShort }}</li>
            <li v-if="u.parking"><i class="fa-solid fa-car" aria-hidden="true"></i> {{ u.parking }} {{ copy.specs.parkingShort }}</li>
            <li v-if="u.builtM2"><i class="fa-solid fa-ruler-combined" aria-hidden="true"></i> {{ formatM2(u.builtM2) }}</li>
          </ul>
          <div class="ucard__foot">
            <span class="ucard__price">{{ formatPrice(u.price) }}</span>
            <span class="ucard__cta">{{ copy.project.seeUnit }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
          </div>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.inventory {
  &__table {
    display: none;
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    font-weight: 300;

    @include from('md') {
      display: table;
    }

    th,
    td {
      padding: 1.1rem 0.8rem;
      text-align: left;
      border-bottom: 1px solid $line;
      vertical-align: middle;
    }

    thead th {
      padding-block: 0 0.9rem;
      @include caps(0.6875rem, 0.2em);
      color: $ink-muted;
      border-bottom-color: $navy-900;
    }

    th:first-child {
      padding-left: 0;
    }

    tbody th {
      font-weight: 400;

      small {
        display: block;
        margin-top: 0.2rem;
        font-size: $text-xs;
        font-weight: 300;
        color: $ink-muted;
      }
    }

    tbody tr {
      @include transition(background);

      &:hover {
        background: $gray-50;
      }

      &.is-reserved td:not(:nth-last-child(-n + 2)),
      &.is-reserved th {
        color: $ink-muted;
      }
    }

    .num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .price {
      font-family: $font-display;
      font-size: 1.3rem;
      font-weight: 500;
      color: $navy-900;
      white-space: nowrap;
    }

    .go {
      padding-right: 0;
      text-align: right;

      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 1px solid $line;
        border-radius: $radius-sm;
        color: $navy-900;
        font-size: 0.75rem;
        @include transition;

        &:hover {
          background: $navy-900;
          border-color: $navy-900;
          color: $surface;
        }
      }
    }
  }

  &__name {
    font-family: $font-display;
    font-size: 1.4rem;
    line-height: 1.15;
    color: $ink;

    &:hover {
      color: $blue-700;
    }
  }

  &__cards {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.8rem);

    @include from('md') {
      display: none;
    }
  }
}

.ucard {
  @include card;
  @include flex(column, stretch, flex-start, 0.5rem);
  padding: 1.5rem 1.4rem 1.3rem;

  &__top {
    @include flex(row, center, space-between, 0.5rem);
  }

  &__type {
    @include caps(0.6875rem, 0.22em);
    color: $blue-700;
  }

  &__name {
    font-family: $font-display;
    font-size: 1.75rem;
    font-weight: 400;
    line-height: 1.1;
    color: $ink;
    margin-top: 0.3rem;
  }

  &__specs {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem 1.2rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    font-weight: 300;
    color: $ink-soft;

    i {
      color: $ink-muted;
      font-size: 0.85em;
      margin-right: 0.3rem;
    }
  }

  &__foot {
    @include flex(row, center, space-between, 0.5rem);
    margin-top: 0.9rem;
    padding-top: 1rem;
    border-top: 1px solid $line;
  }

  &__price {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    color: $navy-900;
  }

  &__cta {
    @include flex(row, center, flex-start, 0.45rem);
    @include caps(0.6875rem, 0.18em);
    color: $blue-700;

    i {
      font-size: 0.7rem;
    }
  }
}
</style>
