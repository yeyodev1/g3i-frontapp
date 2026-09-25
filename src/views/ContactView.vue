<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SellForm from '@/components/forms/SellForm.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useSeo } from '@/composables/useSeo'
import { copyPages } from '@/config/copy.pages'
import type { LeadKind } from '@/types'

const c = copyPages.contact
const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()

// ?interes=vender|comprar|trabajar|consulta elige la pestaña (vender es la de siempre).
const kind = computed<LeadKind>(
  () => (c.interests.find((i) => i.query === route.query.interes)?.key ?? 'sell') as LeadKind,
)
function syncQuery(next: LeadKind) {
  const query = c.interests.find((i) => i.key === next)?.query
  router.replace({ query: { ...route.query, interes: query } })
}

// «593995806119» → «099 580 6119».
function localPhone(intl: string) {
  const d = intl.replace(/\D/g, '').replace(/^593/, '0')
  return d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : d
}
const handle = (url: string) => url.replace(/\/+$/, '').split('/').pop() ?? ''

// Sin teléfono (pedido de la clienta): solo WhatsApp, correo y redes, y solo los que existan.
const channels = computed(() => {
  const ct = catalog.contact
  return [
    ct.whatsapp && {
      icon: 'fa-brands fa-whatsapp',
      text: `${localPhone(ct.whatsapp)} · ${c.whatsappSuffix}`,
      href: `https://wa.me/${ct.whatsapp}`,
    },
    ct.email && { icon: 'fa-regular fa-envelope', text: ct.email, href: `mailto:${ct.email}` },
    ct.instagram && {
      icon: 'fa-brands fa-instagram',
      text: `@${handle(ct.instagram)}`,
      href: ct.instagram,
    },
    ct.facebook && {
      icon: 'fa-brands fa-facebook-f',
      text: handle(ct.facebook),
      href: ct.facebook,
    },
  ].filter(Boolean) as { icon: string; text: string; href: string }[]
})
const photo = computed(() => catalog.site?.settings.about?.image?.url)

useSeo({ title: c.eyebrow, description: c.description })
onMounted(() => catalog.ensureSite())
</script>

<template>
  <div class="contact">
    <!-- El formulario va primero y entero a la vista (pedido de la clienta, 24/9). -->
    <div class="contact__card">
      <SellForm :initial-kind="kind" :title="c.formTitle" compact @kind="syncQuery" />
    </div>

    <section class="contact__intro">
      <p class="contact__eyebrow">{{ c.eyebrow }}</p>
      <h1 class="contact__title">
        {{ c.title }} <em>{{ c.titleEm }}</em>
      </h1>
      <p v-for="p in c.paragraphs" :key="p" class="contact__text">{{ p }}</p>
      <p class="contact__welcome">{{ c.welcome }}</p>

      <ul class="contact__channels" :aria-label="c.channelsLabel">
        <li v-for="ch in channels" :key="ch.href">
          <a
            :href="ch.href"
            :target="ch.href.startsWith('http') ? '_blank' : undefined"
            rel="noopener"
          >
            <i :class="ch.icon" aria-hidden="true"></i>
            <span>{{ ch.text }}</span>
          </a>
        </li>
      </ul>

      <figure v-if="photo" class="contact__photo">
        <img :src="photo" :alt="c.photoAlt" loading="lazy" />
      </figure>
    </section>
  </div>
</template>

<style scoped lang="scss">
.contact {
  @include container;
  @include flex(column, stretch, flex-start, 3rem);
  padding-block: clamp(1.25rem, 2vw, 1.75rem) $space-section;

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 72px;
  }

  &__intro,
  &__card {
    flex: 1 1 0;
    min-width: 0;
  }

  // En escritorio el texto baja a acompañar al formulario.
  &__intro {
    @include from('lg') {
      padding-top: 1rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2.5rem, 1.6rem + 3.6vw, 4rem));
    line-height: 1.04;
    margin-top: 0.9rem;
    color: $ink;
    @include title-rule;

    em {
      font-style: italic;
    }
  }

  &__text {
    margin-top: 1.5rem;
    font-size: 1.0625rem;
    font-weight: 300;
    line-height: 1.75;
    color: $ink-body;

    & + & {
      margin-top: 1rem;
    }
  }

  &__welcome {
    margin-top: 1.5rem;
    font: italic 400 1.5rem/1.2 $font-display;
    color: $blue-600;
  }

  &__channels {
    list-style: none;
    margin-top: 2.25rem;
    @include flex(column, flex-start, flex-start, 1rem);

    a {
      @include flex(row, center, flex-start, 0.9rem);
      font-size: 0.95rem;
      font-weight: 300;
      color: $ink-body;
      @include transition(color);

      &:hover {
        color: $ember-600;
      }
    }

    i {
      width: 18px;
      text-align: center;
      color: $ember-500;
      font-size: 1.05rem;
    }
  }

  &__photo {
    margin-top: 2.25rem;

    img {
      width: 100%;
      height: 220px;
      object-fit: cover;
    }
  }

  &__card {
    border: 1px solid $line;
    background: $surface;
    padding: 1.5rem 1.25rem;

    @include from('md') {
      padding: 1.4rem 2.25rem 1.5rem;
    }
  }
}
</style>
