<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import ShareButton from '@/components/common/ShareButton.vue'
import { useSectionSpy } from '@/composables/useSectionSpy'
import { site } from '@/config/site'
import { copyProjects } from '@/config/copy.projects'

const props = defineProps<{
  sections: ReadonlyArray<{ id: string; label: string }>
  name?: string
  whatsappHref: string
  shareTitle: string
}>()

const ids = computed(() => props.sections.map((s) => s.id))
const { active, scrollTo } = useSectionSpy(ids)
const track = ref<HTMLElement | null>(null)

// En móvil la barra se desliza para que la sección activa quede a la vista.
watch(active, async (id) => {
  await nextTick()
  const link = track.value?.querySelector<HTMLElement>(`[data-id="${id}"]`)
  const box = track.value
  if (!link || !box) return
  box.scrollTo({
    left: link.offsetLeft - box.clientWidth / 2 + link.clientWidth / 2,
    behavior: 'smooth',
  })
})

defineExpose({ scrollTo })
</script>

<template>
  <nav class="snav" :aria-label="copyProjects.sectionsLabel">
    <div class="snav__inner">
      <span v-if="name" class="snav__name">{{ name }}</span>
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
      <div class="snav__actions">
        <ShareButton :title="shareTitle" compact />
        <a :href="whatsappHref" target="_blank" rel="noopener" class="btn btn--ghost snav__wa">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ site.detail.whatsappCta }}
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.snav {
  position: sticky;
  // Alto real del header (72/92px + borde). Si el layout expone --header-h, manda ese.
  top: var(--header-h, 73px);

  @include from('lg') {
    top: var(--header-h, 93px);
  }
  z-index: 50;
  transition: top 0.35s ease;
  background: rgba($paper, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $line;

  &__inner {
    @include container;
    @include flex(row, center, flex-start, 1.5rem);
    padding-inline: 0;

    @include from('md') {
      padding-inline: 2rem;
    }
  }

  &__name {
    display: none;

    @include from('xl') {
      display: block;
      flex-shrink: 0;
      max-width: 14ch;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: $font-display;
      font-size: 1.25rem;
      color: $ink;
    }
  }

  &__track {
    @include flex(row, center, flex-start, 0.25rem);
    flex: 1 1 auto;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
    padding-inline: 1.25rem;

    @include from('md') {
      padding-inline: 0;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__link {
    flex-shrink: 0;
    position: relative;
    padding: 0.95rem 0.75rem;
    @include caps(0.6875rem, 0.2em);
    color: $ink;
    white-space: nowrap;
    @include transition(color);

    &::after {
      content: '';
      position: absolute;
      left: 0.75rem;
      right: 0.75rem;
      bottom: -1px;
      height: 1px;
      background: $blue-700;
      transform: scaleX(0);
      transition: transform 0.3s $ease;
    }

    &:hover {
      color: $blue-700;
    }

    &--active {
      color: $blue-700;

      &::after {
        transform: scaleX(1);
      }
    }
  }

  &__actions {
    display: none;

    @include from('lg') {
      @include flex(row, center, flex-end, 0.5rem);
      flex-shrink: 0;
    }
  }

  &__wa {
    min-height: 36px;
    padding-block: 0.4rem;
    padding-inline: 1.1rem;
  }

  &__actions :deep(.share__btn) {
    width: 36px;
    height: 36px;
  }
}
</style>
