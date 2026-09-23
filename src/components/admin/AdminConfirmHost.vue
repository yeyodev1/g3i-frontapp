<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'
import { useAdminConfirm } from '@/composables/useAdminConfirm'

const { state, answer } = useAdminConfirm()
</script>

<template>
  <BaseModal
    :open="state.open"
    :title="state.options.title"
    :message="state.options.message"
    :confirm-label="state.options.confirmLabel"
    :cancel-label="state.options.cancelLabel"
    :danger="state.options.danger"
    @confirm="answer(true)"
    @cancel="answer(false)"
  />
</template>
