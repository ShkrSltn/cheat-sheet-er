<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNavigation } from '@/composables/useNavigation'
import { AppButton } from '@/components/shared'
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
        <AppButton
          variant="ghost"
          icon="arrow-left"
          @click="goHome"
        >
          Back to Home
        </AppButton>
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

          <AppButton
            type="submit"
            variant="primary"
            full-width
            icon="sign-in-alt"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          >
            <template #loading>Signing in...</template>
            Sign In
          </AppButton>
        </form>

        <div class="mt-6 text-center">
          <p class="text-[var(--color-text-secondary)]">
            Don't have an account?
            <AppButton
              variant="link"
              size="sm"
              @click="goToRegister"
            >
              Sign up
            </AppButton>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
