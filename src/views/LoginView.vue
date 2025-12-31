<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNavigation } from '@/composables/useNavigation'
import type { LoginCredentials } from '@/types'

const authStore = useAuthStore()
const { navigateToRegister: goToRegister, navigateToHome: goHome, navigateToDashboard } =
  useNavigation()

const credentials = ref<LoginCredentials>({
  email: '',
  password: '',
})

const error = ref<string>('')
const isSubmitting = computed<boolean>(() => authStore.isLoading)

const handleSubmit = async (): Promise<void> => {
  error.value = ''

  if (!credentials.value.email || !credentials.value.password) {
    error.value = 'Please fill in all fields'
    return
  }

  const result = await authStore.login(credentials.value)

  if (result.success) {
    navigateToDashboard()
  } else {
    error.value = result.error || 'Login failed'
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center justify-center"
  >
    <div class="max-w-md w-full mx-4">
      <!-- Navigation -->
      <div class="mb-6">
        <button
          @click="goHome"
          class="flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] px-3 py-2 rounded-md transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </button>
      </div>

      <!-- Login Form -->
      <div class="bg-[var(--color-bg-secondary)] rounded-lg shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Welcome Back</h1>
          <p class="text-[var(--color-text-secondary)]">Sign in to your account</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <div
            v-if="error"
            class="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md"
          >
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full border border-[var(--color-accent)] text-[var(--color-accent)] py-2 px-4 rounded-md hover:bg-[var(--color-accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span v-if="isSubmitting">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-[var(--color-text-secondary)]">
            Don't have an account?
            <button
              @click="goToRegister"
              class="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
