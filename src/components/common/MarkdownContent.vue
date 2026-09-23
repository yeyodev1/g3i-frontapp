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
.prose {
  color: $ink-soft;
  font-size: $text-base;
  line-height: 1.75;

  :deep(p) {
    margin-bottom: 1.1em;
  }

  :deep(h2) {
    @include display($text-xl, 600);
    color: $ink;
    margin: 1.8em 0 0.6em;
  }

  :deep(ul) {
    margin: 0 0 1.1em 1.2em;
  }

  :deep(li) {
    margin-bottom: 0.35em;
  }

  :deep(li::marker) {
    color: $brand-blue;
  }

  :deep(strong) {
    color: $ink;
    font-weight: 600;
  }

  :deep(a) {
    color: $ink;
    text-decoration: underline;
    text-decoration-color: $brand-blue;
    text-underline-offset: 3px;
  }
}
</style>
