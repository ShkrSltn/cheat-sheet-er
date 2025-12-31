<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNavigation } from '@/composables/useNavigation'
import { AppButton } from '@/components/shared'
import type { RegisterCredentials } from '@/types'

const authStore = useAuthStore()
const { navigateToLogin: goToLogin, navigateToHome: goHome, navigateToDashboard } = useNavigation()

const credentials = ref<RegisterCredentials>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref<string>('')
const isSubmitting = computed<boolean>(() => authStore.isLoading)

const handleSubmit = async (): Promise<void> => {
  error.value = ''

  if (
    !credentials.value.name ||
    !credentials.value.email ||
    !credentials.value.password ||
    !credentials.value.confirmPassword
  ) {
    error.value = 'Please fill in all fields'
    return
  }

  if (credentials.value.password !== credentials.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (credentials.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  const result = await authStore.register(credentials.value)

  if (result.success) {
    navigateToDashboard()
  } else {
    error.value = result.error || 'Registration failed'
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center justify-center px-4 py-8"
  >
    <div class="max-w-md w-full">
      <!-- Navigation -->
      <div class="mb-4">
        <AppButton
          variant="ghost"
          icon="arrow-left"
          @click="goHome"
        >
          Back to Home
        </AppButton>
      </div>

      <!-- Register Form -->
      <div class="bg-[var(--color-bg-secondary)] rounded-lg shadow-xl p-6">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Create Account</h1>
          <p class="text-[var(--color-text-secondary)]">Sign up to get started</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              v-model="credentials.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
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
              class="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
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

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="credentials.confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              placeholder="Confirm your password"
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
            variant="emerald"
            full-width
            icon="user-plus"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          >
            <template #loading>Creating account...</template>
            Sign Up
          </AppButton>
        </form>

        <div class="mt-4 text-center">
          <p class="text-[var(--color-text-secondary)]">
            Already have an account?
            <AppButton
              variant="link"
              size="sm"
              @click="goToLogin"
            >
              Sign in
            </AppButton>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
