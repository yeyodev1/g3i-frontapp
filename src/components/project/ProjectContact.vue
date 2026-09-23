<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import LeadForm from '@/components/forms/LeadForm.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import ShareButton from '@/components/common/ShareButton.vue'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

const props = defineProps<{ project: Project; title: string; whatsappHref: string }>()
const message = computed(() => copy.form.interestedIn(props.title, props.project.code))
const refs = computed(() => ({ project: props.project._id, refCode: props.project.code }))
</script>

<template>
  <div class="pcontact">
    <div class="pcontact__info">
      <p class="pcontact__eyebrow">{{ copyProjects.contactEyebrow }}</p>
      <h2 class="pcontact__title">{{ copyProjects.contactTitle }}</h2>
      <p class="pcontact__text">{{ copyProjects.contactText }}</p>
      <p v-if="project.code" class="pcontact__code">{{ copyProjects.code }} {{ project.code }}</p>
      <div class="pcontact__actions">
        <WhatsAppButton :href="whatsappHref" block />
        <div class="pcontact__row">
          <ShareButton :title="title" :text="project.summary" />
          <a v-if="project.brochure?.url" :href="project.brochure.url" target="_blank" rel="noopener" class="pcontact__brochure">
            <i class="fa-regular fa-file-pdf" aria-hidden="true"></i> {{ copyProjects.brochure }}
          </a>
        </div>
      </div>
    </div>
    <LeadForm kind="project" :title="copyProjects.formTitle" :message="message" :refs="refs" class="pcontact__form" />
  </div>
</template>

<style scoped lang="scss">
.pcontact {
  @include flex(column, stretch, flex-start, 1.5rem);

  @include from('lg') {
    flex-direction: row;
    gap: 2.5rem;
  }

  &__info {
    @include card;
    @include flex(column, stretch, flex-start);
    padding: 2rem 1.5rem;

    @include from('md') {
      padding: 2.5rem;
    }

    @include from('lg') {
      flex: 0 0 42%;
    }
  }

  &__form {
    flex: 1;
    min-width: 0;
  }

  &__eyebrow {
    @include eyebrow;
    color: $blue-700;
  }

  &__title {
    @include display(clamp(1.9rem, 1.5rem + 1.4vw, 2.6rem), 300);
    color: $ink;
    margin-top: 1rem;
  }

  &__text {
    margin-top: 1.25rem;
    font-weight: 300;
    line-height: 1.7;
    color: $ink-body;
  }

  &__code {
    margin-top: 1rem;
    @include caps(0.6875rem, 0.2em);
    color: $ink-muted;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 1rem);
    margin-top: auto;
    padding-top: 2rem;
  }

  &__row {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__brochure {
    @include flex(row, center, flex-start, 0.5rem);
    @include caps(0.6875rem, 0.18em);
    color: $navy-900;
    padding-bottom: 0.2rem;
    border-bottom: 1px solid $navy-900;

    i {
      color: $ember-500;
    }

    &:hover {
      color: $ember-600;
      border-color: $ember-600;
    }
  }
}
</style>
