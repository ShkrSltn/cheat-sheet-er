<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'switch-to-register'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const authStore = useAuthStore()

const credentials = ref<LoginCredentials>({
  email: '',
  password: '',
})

const error = ref('')
const isSubmitting = computed(() => authStore.isLoading)

const handleSubmit = async () => {
  error.value = ''

  if (!credentials.value.email || !credentials.value.password) {
    error.value = 'Please fill in all fields'
    return
  }

  const result = await authStore.login(credentials.value)

  if (result.success) {
    emit('close')
    credentials.value = { email: '', password: '' }
  } else {
    error.value = result.error || 'Login failed'
  }
}

const handleClose = () => {
  emit('close')
  credentials.value = { email: '', password: '' }
  error.value = ''
}

const handleSwitchToRegister = () => {
  emit('switch-to-register')
  error.value = ''
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="handleClose"
  >
    <div
      class="bg-[var(--color-bg-primary)] rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-[var(--color-text-primary)]">Sign In</h2>
        <button
          @click="handleClose"
          class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
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
            class="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
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
            class="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-[var(--color-accent)] text-white py-2 px-4 rounded-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isSubmitting">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-[var(--color-text-secondary)]">
          Don't have an account?
          <button
            @click="handleSwitchToRegister"
            class="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
