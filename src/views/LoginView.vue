<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import LoginShowcase from '@/components/admin/LoginShowcase.vue'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const email = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)
const error = ref('')

// Solo rutas internas: un ?next= con otro dominio no debe sacar a nadie del portal.
function nextPath(): string {
  const next = route.query.next
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/admin'
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    if (user.accountType !== 'admin') {
      userStore.clear()
      error.value = adminCopy.login.notAdmin
      return
    }
    toast.success(`Hola, ${user.name || user.email}`)
    router.replace(nextPath())
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <LoginShowcase class="login__show" />

    <div class="login__panel">
      <form class="login__card" @submit.prevent="submit">
        <p class="login__eyebrow">{{ adminCopy.login.eyebrow }}</p>
        <h1 class="login__title">{{ adminCopy.login.title }}</h1>
        <p class="login__text">{{ adminCopy.login.text }}</p>

        <div class="login__field">
          <label for="email">{{ adminCopy.login.emailLabel }}</label>
          <div class="login__input">
            <i class="fa-regular fa-envelope"></i>
            <input id="email" v-model="email" type="email" autocomplete="username" inputmode="email" required />
          </div>
        </div>

        <div class="login__field">
          <label for="password">{{ adminCopy.login.passwordLabel }}</label>
          <div class="login__input">
            <i class="fa-solid fa-lock"></i>
            <input
              id="password"
              v-model="password"
              :type="show ? 'text' : 'password'"
              autocomplete="current-password"
              required
            />
            <button type="button" :aria-label="show ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="show = !show">
              <i :class="show ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
            </button>
          </div>
        </div>

        <Transition name="rise">
          <p v-if="error" class="login__error" role="alert">
            <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
          </p>
        </Transition>

        <button class="btn btn--primary login__submit" type="submit" :disabled="loading">
          <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
          {{ loading ? adminCopy.login.loading : adminCopy.login.submit }}
          <i v-if="!loading" class="fa-solid fa-arrow-right"></i>
        </button>

        <p class="login__secure"><i class="fa-solid fa-shield-halved"></i> {{ adminCopy.login.secure }}</p>

        <RouterLink to="/" class="login__back">
          <i class="fa-solid fa-arrow-left"></i> {{ adminCopy.login.back }}
        </RouterLink>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login {
  @include flex(column, stretch, flex-start);
  min-height: 100vh;
  background: $paper;

  @include from('lg') {
    flex-direction: row;
  }

  &__show {
    @include from('lg') {
      flex: 1.25;
      position: sticky;
      top: 0;
      height: 100vh;
    }
  }

  &__panel {
    position: relative;
    flex: 1;
    @include flex(column, center, center);
    padding: 0 1rem 2rem;
    margin-top: -3rem;

    @include from('lg') {
      margin-top: 0;
      padding: 3rem 2.5rem;
    }
  }

  &__card {
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    max-width: 400px;
    background: $surface;
    border-radius: $radius-lg;
    padding: 2rem 1.4rem;
    box-shadow: $shadow-lg;
    animation: rise-in 0.6s $ease both;

    @include from('lg') {
      box-shadow: none;
      padding: 0;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.6rem);

    &::before {
      content: '';
      width: 1.4rem;
      height: 2px;
      border-radius: 2px;
      background: $brand-orange;
    }
  }

  &__title {
    @include display(clamp(1.7rem, 1.4rem + 1vw, 2.2rem), 700);
    letter-spacing: -0.025em;
  }

  &__text {
    font-size: 0.92rem;
    color: $ink-soft;
    margin-bottom: 0.5rem;
  }

  &__input {
    position: relative;

    > i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.9rem;
      pointer-events: none;
    }

    input {
      min-height: 54px;
      padding-left: 2.7rem;
      padding-right: 3.2rem;
      border-radius: 14px;
      background: $sand;
      border-color: transparent;

      &:focus {
        background: $surface;
        border-color: $ink;
        box-shadow: 0 0 0 4px rgba($ink, 0.08);
      }
    }

    button {
      position: absolute;
      right: 0.3rem;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      color: $ink-muted;
    }
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
  }

  &__submit {
    margin-top: 0.5rem;
    min-height: 56px;
    font-size: 0.95rem;

    .fa-arrow-right {
      transition: transform 0.3s $ease;
    }

    &:hover .fa-arrow-right {
      transform: translateX(4px);
    }
  }

  &__secure {
    @include flex(row, center, center, 0.45rem);
    font-size: $text-xs;
    color: $ink-muted;

    i {
      color: $brand-blue;
    }
  }

  &__back {
    @include flex(row, center, center, 0.45rem);
    font-size: 0.85rem;
    color: $ink-soft;
    min-height: 40px;
    border-top: 1px solid $line;
    padding-top: 0.8rem;

    &:hover {
      color: $ink;
    }
  }
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}
</style>
