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
// no header on auth routes
const authRoutes = ['/login', '/register']
const shouldShowHeader = computed(() => {
  return !authRoutes.includes(route.path)
})
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
    <AppHeader v-if="shouldShowHeader" />

    <AuthGuard v-if="shouldShowAuthGuard" :require-auth="true">
      <router-view />
    </AuthGuard>

    <router-view v-else />
  </div>
</template>
