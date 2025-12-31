<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useNavigation } from '@/composables/useNavigation'
import type { AuthGuardProps } from '@/types/components'

const props = withDefaults(defineProps<AuthGuardProps>(), {
  requireAuth: true,
})

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const shouldShowContent = computed(() => {
  return props.requireAuth ? isAuthenticated.value : true
})

const { navigateToLogin: handleLogin, navigateToRegister: handleRegister } = useNavigation()
</script>

<template>
  <div v-if="shouldShowContent">
    <slot />
  </div>
  <div
    v-else
    class="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center justify-center"
  >
    <div class="text-center">
      <div class="mb-8">
        <svg
          class="w-24 h-24 mx-auto text-[var(--color-text-secondary)] opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
        Authentication Required
      </h2>
      <p class="text-[var(--color-text-secondary)] mb-8 max-w-md">
        Please sign in to access your cheat sheets collection.
      </p>
      <div class="flex justify-center space-x-4">
        <button
          @click="handleLogin"
          class="border border-[var(--color-accent)] text-[var(--color-accent)] px-6 py-3 rounded-md hover:bg-[var(--color-accent)] hover:text-white transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Sign In
        </button>
        <button
          @click="handleRegister"
          class="border border-emerald-400 text-emerald-400 px-6 py-3 rounded-md hover:bg-emerald-400 hover:text-white transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Sign Up
        </button>
      </div>
    </div>
  </div>
</template>
