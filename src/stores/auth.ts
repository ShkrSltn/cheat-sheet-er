import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterCredentials, AuthState } from '@/types'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!api.getToken())

  const authState = computed(
    (): AuthState => ({
      user: user.value,
      isAuthenticated: isAuthenticated.value,
      isLoading: isLoading.value,
    }),
  )

  // Initialize user from token if available
  const initAuth = async (): Promise<void> => {
    const token: string | null = api.getToken()
    if (token && !user.value) {
      try {
        const profile: User = await api.getProfile()
        user.value = profile
      } catch {
        // Token is invalid, clear it
        api.setToken(null)
      }
    }
  }

  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true

    try {
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Email and password are required' }
      }

      const response = await api.login(credentials)

      api.setToken(response.access_token)
      user.value = response.user

      return { success: true }
    } catch (error) {
      const message: string =
        error instanceof Error ? error.message : 'Login failed. Please try again.'
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (
    credentials: RegisterCredentials,
  ): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true

    try {
      // Validate input
      if (!credentials.email || !credentials.password || !credentials.name) {
        return { success: false, error: 'All fields are required' }
      }

      if (credentials.password !== credentials.confirmPassword) {
        return { success: false, error: 'Passwords do not match' }
      }

      if (credentials.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
      }

      const response = await api.register(credentials)

      api.setToken(response.access_token)
      user.value = response.user

      return { success: true }
    } catch (error) {
      const message: string =
        error instanceof Error ? error.message : 'Registration failed. Please try again.'
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    user.value = null
    api.setToken(null)
  }

  const clearAuth = (): void => {
    user.value = null
    api.setToken(null)
  }

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    isAuthenticated,
    authState,

    // Actions
    initAuth,
    login,
    register,
    logout,
    clearAuth,
  }
})
