<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const handleLogin = () => {
  router.push('/login')
}

const handleRegister = () => {
  router.push('/register')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleProfile = () => {
  router.push('/profile')
}

const handleLogoClick = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    router.push('/')
  }
}
</script>

<template>
  <header class="border-b border-[var(--color-border)]">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <button @click="handleLogoClick" class="text-left hover:opacity-80 transition-opacity">
          <h1 class="text-2xl font-light text-[var(--color-text-primary)]">Notareon</h1>
          <p class="text-sm mt-1 text-[var(--color-text-primary)] opacity-80">
            Your personal cheat sheets collection
          </p>
        </button>

        <!-- Authentication Section -->
        <div v-if="!isAuthenticated" class="flex items-center space-x-4">
          <button
            @click="handleLogin"
            class="border border-[var(--color-accent)] text-[var(--color-accent)] px-4 py-2 rounded-md hover:bg-[var(--color-accent)] hover:text-white transition-colors font-medium flex items-center gap-2"
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
            class="border border-emerald-400 text-emerald-400 px-4 py-2 rounded-md hover:bg-emerald-400 hover:text-white transition-colors font-medium flex items-center gap-2"
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

        <!-- User Section -->
        <div v-else class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm font-medium text-[var(--color-text-primary)]">
              {{ user?.name }}
            </p>
            <p class="text-xs text-[var(--color-text-secondary)]">
              {{ user?.email }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="handleProfile"
              class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              title="Profile"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
            <button
              @click="handleLogout"
              class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              title="Sign Out"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
