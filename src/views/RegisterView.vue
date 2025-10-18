<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RegisterCredentials } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref<RegisterCredentials>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const isSubmitting = computed(() => authStore.isLoading)

const handleSubmit = async () => {
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
    router.push('/dashboard')
  } else {
    error.value = result.error || 'Registration failed'
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goHome = () => {
  router.push('/')
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

      <!-- Register Form -->
      <div class="bg-[var(--color-bg-secondary)] rounded-lg shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Create Account</h1>
          <p class="text-[var(--color-text-secondary)]">Sign up to get started</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
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

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
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

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full border border-emerald-400 text-emerald-400 py-2 px-4 rounded-md hover:bg-emerald-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span v-if="isSubmitting">Creating account...</span>
            <span v-else>Sign Up</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-[var(--color-text-secondary)]">
            Already have an account?
            <button
              @click="goToLogin"
              class="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
