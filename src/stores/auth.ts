import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterCredentials, AuthState } from '@/types'
import { useLocalStorage } from '@/composables/useLocalStorage'

const AUTH_STORAGE_KEY = 'auth-user'

export const useAuthStore = defineStore('auth', () => {
  const userStorage = useLocalStorage<User | null>(AUTH_STORAGE_KEY, null)

  const user = ref<User | null>(userStorage.getItem())
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  const authState = computed(
    (): AuthState => ({
      user: user.value,
      isAuthenticated: isAuthenticated.value,
      isLoading: isLoading.value,
    }),
  )

  const saveUserToStorage = () => {
    userStorage.setItem(user.value)
  }

  const generateId = (): string => {
    return crypto.randomUUID()
  }

  const getCurrentTimestamp = (): string => {
    return new Date().toISOString()
  }

  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password combination
      // In a real app, this would validate against a backend
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Email and password are required' }
      }

      // Create user object (in real app, this would come from API)
      const newUser: User = {
        id: generateId(),
        email: credentials.email,
        name: credentials.email.split('@')[0] || 'User', // Use email prefix as name
        createdAt: getCurrentTimestamp(),
      }

      user.value = newUser
      saveUserToStorage()

      return { success: true }
    } catch {
      return { success: false, error: 'Login failed. Please try again.' }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (
    credentials: RegisterCredentials,
  ): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

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

      // Create user object (in real app, this would be sent to API)
      const newUser: User = {
        id: generateId(),
        email: credentials.email,
        name: credentials.name,
        createdAt: getCurrentTimestamp(),
      }

      user.value = newUser
      saveUserToStorage()

      return { success: true }
    } catch {
      return { success: false, error: 'Registration failed. Please try again.' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    saveUserToStorage()
  }

  const clearAuth = () => {
    user.value = null
    userStorage.removeItem()
  }

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    isAuthenticated,
    authState,

    // Actions
    login,
    register,
    logout,
    clearAuth,
  }
})
