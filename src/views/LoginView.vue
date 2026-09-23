<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
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
    <form class="login__card" @submit.prevent="submit">
      <img src="/logo-g3i.png" alt="G3i Inmobiliaria" class="login__logo" />
      <p class="login__eyebrow">{{ adminCopy.login.eyebrow }}</p>
      <h1 class="login__title">{{ adminCopy.login.title }}</h1>
      <p class="login__text">{{ adminCopy.login.text }}</p>

      <div class="login__field">
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="username" inputmode="email" required />
      </div>

      <div class="login__field">
        <label for="password">Contraseña</label>
        <div class="login__pass">
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
      </button>

      <RouterLink to="/" class="login__back">
        <i class="fa-solid fa-arrow-left"></i> {{ adminCopy.login.back }}
      </RouterLink>
    </form>
  </section>
</template>

<style scoped lang="scss">
.login {
  @include flex(column, center, center);
  min-height: 100vh;
  padding: 1.5rem 1rem;

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    max-width: 420px;
    padding: 2rem 1.4rem;
    box-shadow: $shadow-md;

    @include from('sm') {
      padding: 2.5rem 2.2rem;
    }
  }

  &__logo {
    height: 56px;
    width: auto;
    align-self: flex-start;
    margin-bottom: 0.4rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($text-xl, 700);
  }

  &__text {
    font-size: 0.9rem;
    color: $ink-soft;
    margin-bottom: 0.3rem;
  }

  &__field input {
    min-height: 50px;
  }

  &__pass {
    position: relative;

    input {
      padding-right: 3.2rem;
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
    margin-top: 0.4rem;
    min-height: 52px;
  }

  &__back {
    @include flex(row, center, center, 0.45rem);
    font-size: 0.85rem;
    color: $ink-soft;
    min-height: 40px;

    &:hover {
      color: $ink;
    }
  }
}
</style>
