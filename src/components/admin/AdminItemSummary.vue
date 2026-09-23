<script setup lang="ts">
// Vista compacta de un elemento en las listas simples.
defineProps<{ title: string; text?: string; image?: string; round?: boolean; inactive?: boolean; inactiveLabel?: string }>()
</script>

<template>
  <span v-if="image !== undefined" class="summary__img" :class="{ 'summary__img--round': round }">
    <img v-if="image" :src="image" alt="" loading="lazy" />
    <i v-else class="fa-regular fa-image"></i>
  </span>
  <span class="summary__text">
    <strong>{{ title }}</strong>
    <small v-if="text">{{ text }}</small>
    <em v-if="inactive" class="summary__off">{{ inactiveLabel || 'Oculto en el sitio' }}</em>
  </span>
</template>

<style scoped lang="scss">
.summary__img {
  flex: none;
  width: 56px;
  height: 56px;
  border-radius: $radius-sm;
  overflow: hidden;
  background: $sand;
  @include flex(row, center, center);
  color: $ink-muted;

  &--round {
    border-radius: 50%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.summary__text {
  @include flex(column, flex-start, flex-start, 0.15rem);
  min-width: 0;

  strong {
    font-size: 0.95rem;
    line-height: 1.35;
  }

  small {
    font-size: 0.82rem;
    color: $ink-soft;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.summary__off {
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 600;
  color: $ink-muted;
  background: $sand;
  padding: 0.1rem 0.5rem;
  border-radius: $radius-pill;
}
</style>
