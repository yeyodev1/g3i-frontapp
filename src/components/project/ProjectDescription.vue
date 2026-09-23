<script setup lang="ts">
import type { Project } from '@/types'
import ProjectBlockHead from './ProjectBlockHead.vue'
import VideoEmbed from '@/components/common/VideoEmbed.vue'
import { copyProjects } from '@/config/copy.projects'

defineProps<{ project: Project; title: string; paragraphs: string[] }>()
</script>

<template>
  <div class="pdesc">
    <ProjectBlockHead :eyebrow="copyProjects.descriptionEyebrow" :title="copyProjects.descriptionTitle" class="pdesc__head" />
    <div class="pdesc__body">
      <div class="pdesc__text">
        <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
      </div>
      <a v-if="project.brochure?.url" :href="project.brochure.url" target="_blank" rel="noopener" class="btn btn--ghost pdesc__brochure">
        <i class="fa-solid fa-download" aria-hidden="true"></i> {{ copyProjects.brochure }}
      </a>
      <div v-if="project.videos.length" class="pdesc__videos">
        <VideoEmbed v-for="v in project.videos" :key="v.url" :url="v.url" :title="title" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pdesc {
  @include flex(column, stretch, flex-start, 1.75rem);

  @include from('lg') {
    flex-direction: row;
    gap: 5rem;
  }

  &__head {
    @include from('lg') {
      flex: 0 0 32%;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__text {
    font-size: 1.0625rem;
    font-weight: 300;
    line-height: 1.8;
    color: $ink-body;
    max-width: 68ch;

    p + p {
      margin-top: 1.1em;
    }
  }

  &__brochure {
    margin-top: 2rem;

    i {
      color: $ember-500;
      font-size: 0.85rem;
    }

    &:hover i {
      color: inherit;
    }
  }

  &__videos {
    @include flex(column, stretch, flex-start, 1rem);
    margin-top: 2rem;
  }
}
</style>
