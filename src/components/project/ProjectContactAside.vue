<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import LeadForm from '@/components/forms/LeadForm.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'

const props = defineProps<{ project: Project; title: string; whatsappHref: string }>()
const message = computed(() => copy.form.interestedIn(props.title, props.project.code))
const refs = computed(() => ({ project: props.project._id, refCode: props.project.code }))
</script>

<template>
  <aside class="aside">
    <LeadForm kind="project" :message="message" :refs="refs" />
    <WhatsAppButton :href="whatsappHref" block />
    <a v-if="project.brochure?.url" :href="project.brochure.url" target="_blank" rel="noopener" class="aside__brochure">
      <i class="fa-regular fa-file-pdf"></i> {{ site.detail.brochureCta }}
    </a>
  </aside>
</template>

<style scoped lang="scss">
.aside {
  @include flex(column, stretch, flex-start, 0.8rem);

  @include from('lg') {
    position: sticky;
    top: calc(64px + 56px + 1rem);
  }

  &__brochure {
    @include flex(row, center, center, 0.5rem);
    min-height: 2.9rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    text-decoration: underline;
    text-underline-offset: 4px;

    i {
      color: $brand-orange;
    }
  }
}
</style>
