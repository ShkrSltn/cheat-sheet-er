<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AuthGuard from '@/components/AuthGuard.vue'

const route = useRoute()

// Страницы, которые не требуют авторизации
const publicRoutes = ['/', '/login', '/register']

const isPublicRoute = computed(() => {
  return publicRoutes.includes(route.path)
})

const shouldShowAuthGuard = computed(() => {
  return !isPublicRoute.value
})
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
    <AppHeader />

    <AuthGuard v-if="shouldShowAuthGuard" :require-auth="true">
      <router-view />
    </AuthGuard>

    <router-view v-else />
  </div>
</template>
