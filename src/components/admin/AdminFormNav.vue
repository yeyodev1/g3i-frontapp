<script setup lang="ts">
defineProps<{ sections: { id: string; label: string }[] }>()

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <nav class="formnav" aria-label="Secciones del formulario">
    <button v-for="(s, i) in sections" :key="s.id" type="button" class="formnav__item" @click="go(s.id)">
      <span class="formnav__n">{{ i + 1 }}</span> {{ s.label }}
    </button>
  </nav>
</template>

<style scoped lang="scss">
.formnav {
  position: sticky;
  top: 60px;
  z-index: 15;
  @include flex(row, center, flex-start, 0.4rem);
  overflow-x: auto;
  scrollbar-width: none;
  background: $sand;
  padding: 0.6rem 0;
  margin-bottom: 1rem;

  @include from('lg') {
    top: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &__item {
    flex: none;
    @include flex(row, center, center, 0.4rem);
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.5rem 0.9rem;
    border-radius: $radius-pill;
    background: $surface;
    border: 1px solid $line;
    min-height: 40px;

    &:hover {
      border-color: $ink;
    }
  }

  &__n {
    @include flex(row, center, center);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $sand;
    font-size: 0.7rem;
  }
}
</style>
