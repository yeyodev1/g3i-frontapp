<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{ source: string }>()
// renderMarkdown escapa todo el HTML antes de reconocer el markdown mínimo.
const html = computed(() => renderMarkdown(props.source))
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="prose" v-html="html"></div>
</template>

<style scoped lang="scss">
// Tipografía editorial: Jost ligera y amplia para leer, Cormorant para los subtítulos.
.prose {
  color: $ink-body;
  font-size: 1.0625rem;
  font-weight: 300;
  line-height: 1.8;

  :deep(p) {
    margin-bottom: 1.2em;
  }

  :deep(h2) {
    font: 400 clamp(1.6rem, 1.3rem + 1vw, 2rem) / 1.15 $font-display;
    color: $ink;
    margin: 1.9em 0 0.6em;
  }

  :deep(h3) {
    font: 500 1.35rem/1.2 $font-display;
    color: $ink;
    margin: 1.6em 0 0.5em;
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 1.2em 1.2em;
  }

  :deep(li) {
    margin-bottom: 0.4em;
    padding-left: 0.2em;
  }

  :deep(li::marker) {
    color: $ember-500;
  }

  :deep(strong) {
    color: $ink;
    font-weight: 500;
  }

  :deep(blockquote) {
    margin: 1.6em 0;
    padding-left: 1.2em;
    border-left: 2px solid $ember-500;
    font: italic 400 1.4rem/1.4 $font-display;
    color: $ink;
  }

  :deep(a) {
    color: $navy-900;
    font-weight: 400;
    text-decoration: underline;
    text-decoration-color: $ember-500;
    text-underline-offset: 3px;

    &:hover {
      color: $ember-600;
    }
  }

  :deep(> :last-child) {
    margin-bottom: 0;
  }
}
</style>
