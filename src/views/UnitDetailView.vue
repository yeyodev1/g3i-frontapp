<script setup lang="ts">
import { computed } from 'vue'
import SpecList from '@/components/common/SpecList.vue'
import ImageLightbox from '@/components/common/ImageLightbox.vue'
import LeadForm from '@/components/forms/LeadForm.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import ShareButton from '@/components/common/ShareButton.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import UnitStatusBadge from '@/components/project/UnitStatusBadge.vue'
import { useProjectUnit } from '@/composables/useProjectUnit'
import { useGallery } from '@/composables/useGallery'
import { useCatalogStore } from '@/stores/catalog'
import { unitSpecs } from '@/utils/specs'
import { formatPrice } from '@/utils/format'
import { toParagraphs } from '@/utils/markdown'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

const { slug, detail, project, unit, projectTitle, listingTitle, refCode, images, whatsappHref } = useProjectUnit()
const catalog = useCatalogStore()
const gallery = useGallery(computed(() => images.value.length))

const specs = computed(() => (unit.value ? unitSpecs(unit.value) : []))
const paragraphs = computed(() => toParagraphs(unit.value?.description ?? ''))
const photoOffset = computed(() => (unit.value?.floorPlan ? 1 : 0))
const message = computed(() => copy.form.interestedIn(listingTitle.value, refCode.value))
const refs = computed(() =>
  project.value && unit.value ? { project: project.value._id, unit: unit.value._id, refCode: refCode.value } : undefined,
)
</script>

<template>
  <div class="unit">
    <div class="unit__wrap">
      <RouterLink :to="`/proyectos/${slug}`" class="unit__back">
        <i class="fa-solid fa-arrow-left"></i> {{ copy.unit.back }}
      </RouterLink>

      <SkeletonCards v-if="detail.loading.value && !unit" :count="2" basis="320px" />

      <StateMessage
        v-else-if="detail.notFound.value"
        icon="fa-solid fa-key"
        :title="copy.unit.notFoundTitle"
        :text="copy.unit.notFoundText"
        :link-to="`/proyectos/${slug}`"
        :link-label="copy.unit.back"
      />

      <StateMessage v-else-if="detail.error.value" icon="fa-solid fa-triangle-exclamation" :title="copy.common.error" :text="detail.error.value" retry @retry="detail.load()" />

      <template v-else-if="unit && project">
        <header class="unit__head">
          <p class="unit__eyebrow">{{ copyProjects.unitOf }} {{ projectTitle }}</p>
          <div class="unit__title-row">
            <h1 class="unit__title">{{ unit.name }}</h1>
            <UnitStatusBadge :status="unit.status" />
          </div>
          <p class="unit__place">
            {{ catalog.typeLabel(unit.type) }} · {{ catalog.sectorLabel(project.sector) }} · {{ copy.common.city }}
          </p>
        </header>

        <div class="unit__layout">
          <div class="unit__main">
            <section v-if="unit.floorPlan" class="unit__block">
              <h2 class="unit__h2">{{ copy.unit.floorPlan }}</h2>
              <button type="button" class="unit__plan" :aria-label="copyProjects.galleryOpen" @click="gallery.show(0)">
                <img :src="unit.floorPlan.url" :alt="`${copy.unit.floorPlan} ${unit.name}`" />
                <span class="unit__zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </button>
            </section>

            <section v-if="unit.images.length" class="unit__block">
              <h2 class="unit__h2">{{ copy.unit.photos }}</h2>
              <div class="unit__photos">
                <button v-for="(img, i) in unit.images" :key="img.url" type="button" class="unit__photo" @click="gallery.show(i + photoOffset)">
                  <img :src="img.url" :alt="img.alt || unit.name" loading="lazy" />
                </button>
              </div>
            </section>

            <section v-if="specs.length" class="unit__block">
              <SpecList :specs="specs" size="lg" />
            </section>

            <section v-if="paragraphs.length" class="unit__block unit__text">
              <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
            </section>
          </div>

          <aside class="unit__aside">
            <div class="unit__price-box">
              <span class="unit__price-label">{{ copyProjects.unitPrice }}</span>
              <strong class="unit__price">{{ formatPrice(unit.price) }}</strong>
              <p v-if="unit.status === 'reserved'" class="unit__reserved">{{ copy.unit.reservedNote }}</p>
              <div class="unit__actions">
                <WhatsAppButton :href="whatsappHref" block />
                <ShareButton :title="listingTitle" compact />
              </div>
            </div>
            <LeadForm kind="unit" :title="copyProjects.unitContactTitle" :message="message" :refs="refs" />
          </aside>
        </div>

        <ImageLightbox :images="images" :gallery="gallery" :title="listingTitle" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.unit {
  &__wrap {
    @include container;
    padding-block: 1.5rem $space-xl;
  }

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    display: inline-flex;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 1.5rem;

    i {
      color: $brand-blue;
      font-size: 0.8em;
    }

    &:hover {
      color: $ink;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.5rem;
  }

  &__title-row {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
  }

  &__title {
    @include display($display-md, 600);
  }

  &__place {
    margin-top: 0.5rem;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-lg);
    margin-top: $space-lg;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__aside {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex: 0 0 360px;
      position: sticky;
      top: calc(64px + 1rem);
    }
  }

  &__block + &__block {
    margin-top: 2rem;
  }

  &__h2 {
    @include display($text-lg, 600);
    margin-bottom: 0.9rem;
  }

  &__plan {
    position: relative;
    width: 100%;
    padding: 1rem;
    border: 1px solid $line;
    border-radius: $radius-md;
    background: $surface;

    img {
      width: 100%;
      max-height: 560px;
      object-fit: contain;
    }
  }

  &__zoom {
    position: absolute;
    right: 0.8rem;
    bottom: 0.8rem;
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: $ink;
    color: $surface;
    font-size: 0.85rem;
  }

  &__photos {
    @include flex-cards(140px, 0.5rem);
  }

  &__photo {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: $radius-sm;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__text {
    color: $ink-soft;
    max-width: 68ch;

    p + p {
      margin-top: 1em;
    }
  }

  &__price-box {
    @include card;
    @include flex(column, stretch, flex-start, 0.4rem);
    padding: 1.25rem;
  }

  &__price-label {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__price {
    @include display($display-sm, 700);
  }

  &__reserved {
    font-size: $text-sm;
    color: $ink-soft;
    padding: 0.6rem 0.8rem;
    border-left: 2px solid $brand-orange;
    background: $sand;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    margin-top: 0.6rem;

    > :first-child {
      flex: 1;
    }
  }
}
</style>
