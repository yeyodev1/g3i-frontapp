<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useSectionSpy } from '@/composables/useSectionSpy'
import { copyProjects } from '@/config/copy.projects'

const props = defineProps<{ sections: ReadonlyArray<{ id: string; label: string }> }>()

const ids = computed(() => props.sections.map((s) => s.id))
const { active, scrollTo } = useSectionSpy(ids)
const track = ref<HTMLElement | null>(null)

// En móvil la barra se desliza para que la sección activa quede a la vista.
watch(active, async (id) => {
  await nextTick()
  const link = track.value?.querySelector<HTMLElement>(`[data-id="${id}"]`)
  link?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
})
</script>

<template>
  <nav class="snav" :aria-label="copyProjects.sectionsLabel">
    <div ref="track" class="snav__track">
      <a
        v-for="section in sections"
        :key="section.id"
        :href="`#${section.id}`"
        :data-id="section.id"
        class="snav__link"
        :class="{ 'snav__link--active': active === section.id }"
        :aria-current="active === section.id ? 'true' : undefined"
        @click.prevent="scrollTo(section.id)"
      >
        {{ section.label }}
      </a>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.snav {
  position: sticky;
  top: 64px;
  z-index: 50;
  background: rgba($paper, 0.96);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid $line;

  &__track {
    @include container;
    @include flex(row, center, flex-start, 1.4rem);
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__link {
    flex-shrink: 0;
    position: relative;
    padding-block: 0.95rem;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-muted;
    white-space: nowrap;
    @include transition(color);

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 2px;
      background: $ink;
      transform: scaleX(0);
      transition: transform 0.3s $ease;
    }

    &:hover {
      color: $ink;
    }

    &--active {
      color: $ink;

      &::after {
        transform: scaleX(1);
      }
    }
  }
}
</style>
