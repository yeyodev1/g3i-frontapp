<template>
  <div class="dskel" aria-busy="true">
    <span class="visually-hidden">Cargando…</span>
    <div class="dskel__media"></div>
    <div class="dskel__row">
      <div class="dskel__main">
        <div class="dskel__line dskel__line--sm"></div>
        <div class="dskel__line dskel__line--lg"></div>
        <div class="dskel__line dskel__line--md"></div>
        <div class="dskel__boxes">
          <div v-for="n in 4" :key="n" class="dskel__box"></div>
        </div>
        <div v-for="n in 4" :key="`l${n}`" class="dskel__line"></div>
      </div>
      <div class="dskel__aside"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
%shimmer {
  border-radius: $radius-sm;
  background: linear-gradient(90deg, $sand 0%, darken($sand, 3%) 50%, $sand 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

.dskel {
  &__media {
    @extend %shimmer;
    aspect-ratio: 4 / 3;
    border-radius: $radius-sm;

    @include from('md') {
      aspect-ratio: 16 / 9;
    }
  }

  &__row {
    @include flex(column, stretch, flex-start, 2rem);
    margin-top: 2rem;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    flex: 1;
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__line {
    @extend %shimmer;
    height: 0.9rem;

    &--sm {
      width: 25%;
    }

    &--md {
      width: 45%;
    }

    &--lg {
      width: 75%;
      height: 2rem;
    }
  }

  &__boxes {
    @include flex-cards(120px, 0.75rem);
    margin-block: 0.8rem;
  }

  &__box {
    @extend %shimmer;
    height: 5.5rem;
  }

  &__aside {
    @extend %shimmer;
    height: 22rem;
    border-radius: $radius-sm;

    @include from('lg') {
      flex: 0 0 360px;
    }
  }
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
