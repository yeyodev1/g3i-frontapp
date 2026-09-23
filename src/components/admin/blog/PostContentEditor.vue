<script setup lang="ts">
import { computed, ref } from 'vue'
import { renderMarkdown } from '@/composables/useAdminMarkdown'

const model = defineModel<string>({ required: true })
const area = ref<HTMLTextAreaElement | null>(null)
const tab = ref<'write' | 'preview'>('write')
const html = computed(() => renderMarkdown(model.value))

/** Inserta el formato alrededor de lo seleccionado, para no tener que memorizar símbolos. */
function wrap(before: string, after = '', placeholder = 'texto') {
  const el = area.value
  if (!el) return
  const { selectionStart: start, selectionEnd: end, value } = el
  const selected = value.slice(start, end) || placeholder
  model.value = value.slice(0, start) + before + selected + after + value.slice(end)
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(start + before.length, start + before.length + selected.length)
  })
}

function block(prefix: string, placeholder: string) {
  const el = area.value
  if (!el) return
  const start = el.selectionStart
  const needsBreak = start > 0 && !model.value.slice(0, start).endsWith('\n\n')
  wrap(`${needsBreak ? '\n\n' : ''}${prefix}`, '\n\n', placeholder)
}

function link() {
  const url = window.prompt('Pega la dirección del enlace (https://…)')
  if (url) wrap('[', `](${url.trim()})`, 'texto del enlace')
}
</script>

<template>
  <div class="md">
    <div class="md__bar">
      <div class="md__tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'write'" :class="{ on: tab === 'write' }" @click="tab = 'write'">
          Escribir
        </button>
        <button type="button" role="tab" :aria-selected="tab === 'preview'" :class="{ on: tab === 'preview' }" @click="tab = 'preview'">
          Vista previa
        </button>
      </div>
      <div v-if="tab === 'write'" class="md__tools">
        <button type="button" title="Subtítulo" @click="block('## ', 'Subtítulo')"><i class="fa-solid fa-heading"></i></button>
        <button type="button" title="Negrita" @click="wrap('**', '**')"><i class="fa-solid fa-bold"></i></button>
        <button type="button" title="Lista" @click="block('- ', 'Elemento de la lista')"><i class="fa-solid fa-list-ul"></i></button>
        <button type="button" title="Enlace" @click="link"><i class="fa-solid fa-link"></i></button>
      </div>
    </div>

    <textarea v-show="tab === 'write'" ref="area" v-model="model" rows="18" class="md__area"></textarea>
    <div v-show="tab === 'preview'" class="md__preview">
      <div v-if="model.trim()" v-html="html"></div>
      <p v-else class="md__empty">Todavía no hay contenido.</p>
    </div>

    <details class="md__help">
      <summary>Ayuda de formato</summary>
      <ul>
        <li>Deja una <strong>línea en blanco</strong> entre párrafos.</li>
        <li><code>## Subtítulo</code> al inicio de una línea crea un subtítulo.</li>
        <li><code>- elemento</code> en cada línea crea una lista.</li>
        <li><code>**texto**</code> pone el texto en negrita.</li>
        <li><code>[texto](https://…)</code> crea un enlace.</li>
      </ul>
    </details>
  </div>
</template>

<style scoped lang="scss">
.md {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__bar {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
  }

  &__tabs {
    @include flex(row, center, flex-start, 0.2rem);
    background: $sand;
    padding: 0.2rem;
    border-radius: $radius-pill;

    button {
      padding: 0.45rem 1rem;
      border-radius: $radius-pill;
      font-size: 0.85rem;
      font-weight: 600;
      color: $ink-soft;
      min-height: 38px;

      &.on {
        background: $surface;
        color: $ink;
        box-shadow: $shadow-sm;
      }
    }
  }

  &__tools {
    @include flex(row, center, flex-start, 0.25rem);

    button {
      width: 40px;
      height: 40px;
      border-radius: $radius-sm;
      border: 1px solid $line;

      &:hover {
        border-color: $ink;
      }
    }
  }

  &__area {
    min-height: 320px;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 0.9rem;
    line-height: 1.65;
  }

  &__preview {
    @include card;
    padding: 1.2rem;
    min-height: 320px;
    line-height: 1.7;

    :deep(h2) {
      font-size: $text-lg;
      margin: 1.2rem 0 0.5rem;
    }

    :deep(p),
    :deep(ul) {
      margin-bottom: 0.9rem;
    }

    :deep(ul) {
      padding-left: 1.2rem;
    }

    :deep(a) {
      color: $brand-blue;
      text-decoration: underline;
    }
  }

  &__empty {
    color: $ink-muted;
  }

  &__help {
    font-size: 0.85rem;
    color: $ink-soft;

    summary {
      cursor: pointer;
      font-weight: 600;
      min-height: 36px;
      @include flex(row, center, flex-start);
    }

    ul {
      padding-left: 1.2rem;
      @include flex(column, stretch, flex-start, 0.25rem);
    }

    code {
      background: $sand;
      padding: 0.05rem 0.35rem;
      border-radius: 4px;
    }
  }
}
</style>
