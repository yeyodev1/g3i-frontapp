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
              <i class="fa-solid fa-arrow-right"></i>
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
            <strong class="ucard__name">{{ u.name }}</strong>
            <UnitStatusBadge :status="u.status" />
          </div>
          <p class="ucard__type">
            {{ catalog.typeLabel(u.type) }}<template v-if="u.floor"> · {{ copy.specs.floor }} {{ u.floor }}</template>
          </p>
          <ul class="ucard__specs">
            <li v-if="u.bedrooms"><i class="fa-solid fa-bed"></i> {{ u.bedrooms }}</li>
            <li v-if="u.bathrooms"><i class="fa-solid fa-bath"></i> {{ formatNumber(u.bathrooms) }}</li>
            <li v-if="u.parking"><i class="fa-solid fa-car"></i> {{ u.parking }}</li>
            <li v-if="u.builtM2"><i class="fa-solid fa-ruler-combined"></i> {{ formatM2(u.builtM2) }}</li>
          </ul>
          <div class="ucard__foot">
            <span class="ucard__price">{{ formatPrice(u.price) }}</span>
            <span class="ucard__cta">{{ copy.project.seeUnit }} <i class="fa-solid fa-arrow-right"></i></span>
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
    font-size: $text-sm;

    @include from('md') {
      display: table;
    }

    th,
    td {
      padding: 0.85rem 0.7rem;
      text-align: left;
      border-bottom: 1px solid $line;
      vertical-align: middle;
    }

    thead th {
      font-size: $text-xs;
      font-weight: 600;
      color: $ink-muted;
      border-bottom-color: $ink;
    }

    tbody th {
      font-weight: 600;

      small {
        display: block;
        font-weight: 400;
        font-size: $text-xs;
        color: $ink-muted;
      }
    }

    tbody tr {
      @include transition(background);

      &:hover {
        background: $sand;
      }

      &.is-reserved td,
      &.is-reserved th {
        color: $ink-muted;
      }
    }

    .num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .price {
      font-weight: 700;
      color: $ink;
    }

    .go a {
      @include flex(row, center, center);
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      border: 1px solid $line;
      color: $ink;
      font-size: 0.75rem;

      &:hover {
        border-color: $ink;
      }
    }
  }

  &__name:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__cards {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.7rem);

    @include from('md') {
      display: none;
    }
  }
}

.ucard {
  @include card;
  @include flex(column, stretch, flex-start, 0.45rem);
  padding: 1rem;

  &__top {
    @include flex(row, center, space-between, 0.5rem);
  }

  &__name {
    @include display($text-lg, 600);
  }

  &__type {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__specs {
    list-style: none;
    @include flex(row, center, flex-start, 0.3rem 1rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $ink-muted;
      font-size: 0.85em;
      margin-right: 0.2rem;
    }
  }

  &__foot {
    @include flex(row, center, space-between, 0.5rem);
    margin-top: 0.3rem;
    padding-top: 0.7rem;
    border-top: 1px solid $line;
  }

  &__price {
    @include display($text-lg, 700);
  }

  &__cta {
    font-size: $text-sm;
    font-weight: 600;

    i {
      font-size: 0.75em;
      color: $brand-blue;
    }
  }
}
</style>
