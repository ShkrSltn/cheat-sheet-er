import { useRouter, type Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { NavigationComposable } from '@/types'

export function useNavigation(): NavigationComposable {
  const router: Router = useRouter()
  const authStore = useAuthStore()

  const navigateToLogin = (): void => {
    router.push('/login')
  }

  const navigateToRegister = (): void => {
    router.push('/register')
  }

  const navigateToProfile = (): void => {
    router.push('/profile')
  }

  const navigateToDashboard = (): void => {
    router.push('/dashboard')
  }

  const navigateToHome = (): void => {
    router.push('/')
  }

  const logout = (): void => {
    authStore.logout()
    router.push('/login')
  }

  return {
    navigateToLogin,
    navigateToRegister,
    navigateToProfile,
    navigateToDashboard,
    navigateToHome,
    logout,
  }
}

