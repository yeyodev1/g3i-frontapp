<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ url: string; title?: string }>()

// YouTube se embebe con iframe (sin cookies); cualquier otra URL es un archivo.
const youtubeId = computed(() => {
  const m = props.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : ''
})
</script>

<template>
  <div class="video">
    <iframe
      v-if="youtubeId"
      :src="`https://www.youtube-nocookie.com/embed/${youtubeId}`"
      :title="title || 'Video'"
      loading="lazy"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <video v-else :src="url" controls preload="metadata" playsinline></video>
  </div>
</template>

<style scoped lang="scss">
.video {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: $radius-sm;
  overflow: hidden;
  background: $navy-950;

  iframe,
  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    object-fit: contain;
  }
}
</style>
