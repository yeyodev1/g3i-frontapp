<script setup lang="ts">
import { computed, onMounted } from 'vue'
import LeadForm from '@/components/forms/LeadForm.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useSeo } from '@/composables/useSeo'
import { copy } from '@/config/copy.public'

const catalog = useCatalogStore()
const contact = computed(() => catalog.contact)

// Solo se pintan los canales que existen: sin correo, no hay fila de correo.
const channels = computed(() => {
  const c = contact.value
  return [
    c.whatsapp && { icon: 'fa-brands fa-whatsapp', label: copy.contact.whatsapp, value: c.phone || c.whatsapp, href: `https://wa.me/${c.whatsapp}` },
    c.phone && { icon: 'fa-solid fa-phone', label: copy.contact.phone, value: c.phone, href: `tel:${c.phone}` },
    c.email && { icon: 'fa-regular fa-envelope', label: copy.contact.email, value: c.email, href: `mailto:${c.email}` },
    c.address && { icon: 'fa-solid fa-location-dot', label: copy.contact.address, value: c.address, href: '' },
  ].filter(Boolean) as { icon: string; label: string; value: string; href: string }[]
})

useSeo({ title: copy.contact.eyebrow, description: copy.contact.description })
onMounted(() => catalog.ensureSite())
</script>

<template>
  <div class="contact">
    <div class="contact__inner">
      <section class="contact__info">
        <p class="contact__eyebrow">{{ copy.contact.eyebrow }}</p>
        <h1 class="contact__title">{{ copy.contact.title }}</h1>
        <p class="contact__text">{{ copy.contact.text }}</p>

        <ul class="contact__channels">
          <li v-for="ch in channels" :key="ch.label">
            <span class="contact__icon"><i :class="ch.icon" aria-hidden="true"></i></span>
            <div>
              <small>{{ ch.label }}</small>
              <a v-if="ch.href" :href="ch.href" :target="ch.href.startsWith('http') ? '_blank' : undefined" rel="noopener">{{ ch.value }}</a>
              <span v-else>{{ ch.value }}</span>
            </div>
          </li>
        </ul>

        <div v-if="contact.instagram || contact.facebook" class="contact__social">
          <small>{{ copy.contact.social }}</small>
          <div>
            <a v-if="contact.instagram" :href="contact.instagram" target="_blank" rel="noopener" aria-label="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a v-if="contact.facebook" :href="contact.facebook" target="_blank" rel="noopener" aria-label="Facebook">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </section>

      <LeadForm class="contact__form" kind="general" :title="copy.contact.formTitle" text="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact {
  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: clamp(2.5rem, 6vw, 5rem) $space-section;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
    }
  }

  &__info,
  &__form {
    flex: 1 1 0;
    min-width: 0;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.6rem);
    margin-bottom: 0.9rem;

    &::before {
      content: '';
      width: 1.4rem;
      height: 1px;
      background: $brand-orange;
    }
  }

  &__title {
    @include display($display-md, 600);
  }

  &__text {
    margin-top: 1rem;
    color: $ink-soft;
    font-size: $text-lg;
    max-width: 44ch;
  }

  &__channels {
    list-style: none;
    margin-top: 2rem;
    border-top: 1px solid $line;

    li {
      @include flex(row, center, flex-start, 1rem);
      padding-block: 1rem;
      border-bottom: 1px solid $line;
    }

    small {
      display: block;
      font-size: $text-xs;
      color: $ink-muted;
    }

    a,
    span {
      font-weight: 600;
      color: $ink;
      word-break: break-word;
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    background: $sand;
    color: $brand-blue;
  }

  &__social {
    margin-top: 1.5rem;

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }

    div {
      @include flex(row, center, flex-start, 0.5rem);
      margin-top: 0.5rem;
    }

    a {
      @include flex(row, center, center);
      width: 2.6rem;
      height: 2.6rem;
      border-radius: 50%;
      border: 1px solid $line;
      color: $ink;

      &:hover {
        border-color: $ink;
      }
    }
  }
}
</style>
