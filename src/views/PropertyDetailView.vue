<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PropertyGallery from '@/components/property/PropertyGallery.vue'
import PropertySummary from '@/components/property/PropertySummary.vue'
import PropertySidebar from '@/components/property/PropertySidebar.vue'
import PropertyMedia from '@/components/property/PropertyMedia.vue'
import PropertyDetailSkeleton from '@/components/property/PropertyDetailSkeleton.vue'
import PropertyCard from '@/components/property/PropertyCard.vue'
import SpecList from '@/components/common/SpecList.vue'
import AmenityList from '@/components/common/AmenityList.vue'
import LocationMap from '@/components/common/LocationMap.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
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
        <i class="fa-solid fa-arrow-left"></i> {{ copyProperties.back }}
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
        <PropertyGallery :key="property._id" :images="property.images" :title="title" />

        <div class="detail__layout">
          <div class="detail__main">
            <PropertySummary :property="property" :title="title" :place="place" :whatsapp-href="whatsappHref" />

            <SpecList v-if="specs.length" :specs="specs" size="lg" />

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

    <section v-if="related.length" class="related">
      <div class="related__inner">
        <SectionHeading :title="site.detail.relatedProperties" link-to="/propiedades" :link-label="copy.common.seeAll" />
        <div class="related__grid">
          <PropertyCard v-for="item in related.slice(0, 3)" :key="item._id" :property="item" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.detail {
  &__inner {
    @include container(1280px);
    padding-block: 1rem $space-xl;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: 1rem;

    i {
      font-size: 0.8em;
    }

    &:hover {
      color: $ink;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-lg);
    margin-top: 1.75rem;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3rem;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 2rem);
  }

  &__aside {
    @include from('lg') {
      flex: 0 0 370px;
      align-self: stretch;
    }
  }

  &__section {
    padding-top: 2rem;
    border-top: 1px solid $line;
  }

  &__title {
    @include display($text-xl, 600);
    margin-bottom: 1rem;
  }

  &__text {
    color: $ink-soft;
    line-height: 1.75;
    max-width: 68ch;

    p + p {
      margin-top: 1em;
    }
  }
}

.related {
  background: $sand;
  border-top: 1px solid $line;

  &__inner {
    @include container(1280px);
    padding-block: $space-xl;
  }

  &__grid {
    @include flex-cards(280px, 1.5rem);

    > * {
      @include from('lg') {
        max-width: calc(33.333% - 1rem);
      }
    }
  }
}
</style>
