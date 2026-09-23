<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import WhatsAppFloat from '@/layout/WhatsAppFloat.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import ToastList from '@/components/ui/ToastList.vue'

const route = useRoute()
// El portal de la inmobiliaria no lleva header ni footer públicos.
const layout = computed(() => (route.meta.layout as string | undefined) ?? 'public')
</script>

<template>
  <AdminLayout v-if="layout === 'admin'">
    <RouterView />
  </AdminLayout>

  <div v-else-if="layout === 'bare'" class="app app--bare">
    <RouterView />
  </div>

  <div v-else class="app">
    <TheHeader />
    <main class="app__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter />
    <WhatsAppFloat />
  </div>

  <ToastList />
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &--bare {
    background: $sand;
  }
}
</style>
