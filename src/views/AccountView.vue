<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { authService } from '@/services/auth.service'
import { adminCopy } from '@/config/copy.admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminField from '@/components/admin/AdminField.vue'
import type { ApiError } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const current = ref('')
const next = ref('')
const repeat = ref('')
const saving = ref(false)
const error = ref('')

async function changePassword() {
  error.value = ''
  if (next.value.length < 8) return (error.value = adminCopy.account.tooShort)
  if (next.value !== repeat.value) return (error.value = adminCopy.account.mismatch)
  saving.value = true
  try {
    await authService.changePassword(current.value, next.value)
    toast.success(adminCopy.account.saved)
    current.value = ''
    next.value = ''
    repeat.value = ''
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    saving.value = false
  }
}

function logout() {
  userStore.clear()
  toast.info(adminCopy.loggedOut)
  router.replace({ name: 'Login' })
}
</script>

<template>
  <div class="account">
    <AdminPageHeader :title="adminCopy.account.title" :subtitle="userStore.user?.email" />

    <form class="account__card" @submit.prevent="changePassword">
      <h2 class="account__subtitle">{{ adminCopy.account.passwordTitle }}</h2>
      <AdminField label="Contraseña actual" for-id="pw-current">
        <input id="pw-current" v-model="current" type="password" autocomplete="current-password" required />
      </AdminField>
      <AdminField label="Contraseña nueva" for-id="pw-next" :help="adminCopy.account.passwordHelp">
        <input id="pw-next" v-model="next" type="password" autocomplete="new-password" required />
      </AdminField>
      <AdminField label="Repite la contraseña nueva" for-id="pw-repeat" :error="error">
        <input id="pw-repeat" v-model="repeat" type="password" autocomplete="new-password" required />
      </AdminField>
      <button class="btn btn--primary" type="submit" :disabled="saving">
        <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-key'"></i>
        {{ saving ? adminCopy.form.saving : adminCopy.account.passwordTitle }}
      </button>
    </form>

    <button class="btn btn--ghost account__logout" @click="logout">
      <i class="fa-solid fa-right-from-bracket"></i> {{ adminCopy.logout }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.account {
  max-width: 560px;

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1.1rem);
    padding: 1.4rem 1.1rem;

    @include from('md') {
      padding: 1.8rem;
    }

    .btn {
      align-self: flex-start;
    }
  }

  &__subtitle {
    font-size: $text-lg;
    font-weight: 700;
  }

  &__logout {
    margin-top: 1.5rem;
  }
}
</style>
