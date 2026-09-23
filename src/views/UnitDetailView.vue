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

const { slug, detail, project, unit, projectTitle, listingTitle, refCode, images, photos, whatsappHref } = useProjectUnit()
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
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copyProjects.unitBack }}
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
          <p class="unit__eyebrow">
            {{ copyProjects.unitOf }} <RouterLink :to="`/proyectos/${slug}`">{{ projectTitle }}</RouterLink>
          </p>
          <div class="unit__title-row">
            <h1 class="unit__title">{{ unit.name }}</h1>
            <UnitStatusBadge :status="unit.status" />
          </div>
          <p class="unit__place">
            {{ catalog.typeLabel(unit.type) }} · {{ catalog.sectorLabel(project.sector) }}<template v-if="project.locality"> · {{ project.locality }}</template> · {{ copy.common.city }}
          </p>
        </header>

        <div class="unit__layout">
          <div class="unit__main">
            <section v-if="unit.floorPlan" class="unit__block">
              <h2 class="unit__h2">{{ copy.unit.floorPlan }}</h2>
              <button type="button" class="unit__plan" :aria-label="copyProjects.galleryOpen" @click="gallery.show(0)">
                <img :src="unit.floorPlan.url" :alt="`${copy.unit.floorPlan} ${unit.name}`" />
                <span class="unit__zoom"><i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i></span>
              </button>
            </section>

            <section v-if="photos.length" class="unit__block">
              <h2 class="unit__h2">{{ unit.images.length ? copy.unit.photos : copyProjects.projectRenders }}</h2>
              <div class="unit__photos">
                <button v-for="(img, i) in photos" :key="img.url" type="button" class="unit__photo" :aria-label="`${copyProjects.galleryOpen} ${i + 1}`" @click="gallery.show(i + photoOffset)">
                  <img :src="img.url" :alt="img.alt || unit.name" loading="lazy" />
                </button>
              </div>
            </section>

            <section v-if="specs.length" class="unit__block">
              <h2 class="unit__h2">{{ copyProjects.unitSpecsTitle }}</h2>
              <SpecList :specs="specs" size="lg" />
            </section>

            <section v-if="paragraphs.length" class="unit__block">
              <h2 class="unit__h2">{{ copyProjects.unitDescriptionTitle }}</h2>
              <div class="unit__text">
                <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
              </div>
            </section>
          </div>

          <aside class="unit__aside">
            <div class="unit__price-box">
              <span class="unit__price-label">{{ copyProjects.unitPrice }}</span>
              <strong class="unit__price">{{ formatPrice(unit.price) }}</strong>
              <p v-if="refCode" class="unit__ref">{{ copyProjects.code }} {{ refCode }}</p>
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

<style scoped lang="scss" src="./UnitDetailView.scss"></style>
