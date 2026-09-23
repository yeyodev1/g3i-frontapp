<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PropertyGallery from '@/components/property/PropertyGallery.vue'
import PropertySummary from '@/components/property/PropertySummary.vue'
import PropertySidebar from '@/components/property/PropertySidebar.vue'
import PropertyMedia from '@/components/property/PropertyMedia.vue'
import PropertyRelated from '@/components/property/PropertyRelated.vue'
import PropertyDetailSkeleton from '@/components/property/PropertyDetailSkeleton.vue'
import SpecList from '@/components/common/SpecList.vue'
import AmenityList from '@/components/common/AmenityList.vue'
import LocationMap from '@/components/common/LocationMap.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import { usePropertyDetail } from '@/composables/usePropertyDetail'
import { useCatalogStore } from '@/stores/catalog'
import { toParagraphs } from '@/utils/markdown'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyProperties } from '@/config/copy.properties'

const route = useRoute()
const catalog = useCatalogStore()
onMounted(() => catalog.ensureCatalogs())

const { property, loading, error, notFound, related, title, place, specs, hasLocation, leadMessage, whatsappHref, reload } =
  usePropertyDetail(() => String(route.params.slug ?? ''))
</script>

<template>
  <div class="detail">
    <div class="detail__inner">
      <RouterLink to="/propiedades" class="detail__back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copyProperties.back }}
      </RouterLink>

      <PropertyDetailSkeleton v-if="loading && !property" />

      <StateMessage
        v-else-if="notFound"
        icon="fa-regular fa-house"
        :title="copy.property.notFoundTitle"
        :text="copy.property.notFoundText"
        link-to="/propiedades"
        :link-label="copy.property.seeProperties"
      />

      <StateMessage
        v-else-if="error"
        icon="fa-solid fa-triangle-exclamation"
        :title="copy.common.error"
        :text="error"
        retry
        @retry="reload"
      />

      <template v-else-if="property">
        <PropertyGallery
          :id="property._id"
          :key="property._id"
          :images="property.images"
          :title="title"
          :badge="property.badge"
          :share-text="property.summary"
        />

        <div class="detail__layout">
          <div class="detail__main">
            <PropertySummary :property="property" :title="title" :place="place" :whatsapp-href="whatsappHref" />

            <SpecList v-if="specs.length" :specs="specs" size="lg" class="detail__specs" />

            <section v-if="property.description || property.summary" class="detail__section">
              <h2 class="detail__title">{{ site.detail.descriptionTitle }}</h2>
              <div class="detail__text">
                <p v-for="(p, i) in toParagraphs(property.description || property.summary)" :key="i">{{ p }}</p>
              </div>
            </section>

            <section v-if="property.amenities.length" class="detail__section">
              <h2 class="detail__title">{{ site.detail.featuresTitle }}</h2>
              <AmenityList :keys="property.amenities" />
            </section>

            <PropertyMedia
              v-if="property.videos.length || property.floorPlans.length"
              :videos="property.videos"
              :floor-plans="property.floorPlans"
              :title="title"
              class="detail__section"
            />

            <section v-if="hasLocation" class="detail__section">
              <h2 class="detail__title">{{ site.detail.locationTitle }}</h2>
              <LocationMap :location="property.location" :label="place" />
            </section>
          </div>

          <aside class="detail__aside">
            <PropertySidebar :property="property" :whatsapp-href="whatsappHref" :message="leadMessage" />
          </aside>
        </div>
      </template>
    </div>

    <PropertyRelated v-if="related.length" :items="related.slice(0, 3)" />
  </div>
</template>

<style scoped lang="scss">
.detail {
  &__inner {
    @include container;
    padding-block: 1.5rem $space-xl;

    @include from('md') {
      padding-top: 2rem;
    }
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    @include caps(0.72rem, 0.2em);
    color: $ink-muted;
    margin-bottom: 1.25rem;
    @include transition(color);

    i {
      font-size: 0.85em;
    }

    &:hover {
      color: $ember-600;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, 3rem);
    margin-top: 2.25rem;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4.5rem;
      margin-top: 3.5rem;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 3rem);
  }

  &__specs {
    margin-top: -0.75rem;
  }

  &__aside {
    @include from('lg') {
      flex: 0 0 380px;
      align-self: stretch;
    }
  }

  // Encabezado de sección con la línea de las pestañas del sistema de diseño.
  &__title {
    @include caps(0.75rem, 0.22em);
    color: $ink;
    padding-bottom: 0.875rem;
    margin-bottom: 1.75rem;
    border-bottom: 1px solid $line;
    background: linear-gradient($ember-500, $ember-500) left bottom / 3rem 1px no-repeat;
  }

  // El primer párrafo hace de entrada en serif; el resto, texto corrido ligero.
  &__text {
    max-width: 68ch;
    font-size: 1.0625rem;
    font-weight: 300;
    line-height: 1.8;
    color: $ink-body;

    p:first-child {
      font-family: $font-display;
      font-size: clamp(1.35rem, 1.2rem + 0.6vw, 1.625rem);
      font-weight: 400;
      line-height: 1.35;
      color: $ink;
    }

    p + p {
      margin-top: 1.1em;
    }
  }
}
</style>
