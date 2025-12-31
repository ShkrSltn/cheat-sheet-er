<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCheatSheetsStore } from '@/stores/cheatSheets'
import { useToast } from 'vue-toastification'
import type { EditForm, UserStats, CheatSheet } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const cheatSheetsStore = useCheatSheetsStore()
const { user } = storeToRefs(authStore)
const { cheatSheets } = storeToRefs(cheatSheetsStore)

const toast = useToast()

// Load cheat sheets if not already loaded
onMounted(async (): Promise<void> => {
  if (cheatSheets.value.length === 0) {
    try {
      await cheatSheetsStore.fetchCheatSheets()
    } catch (error) {
      console.error('Failed to load cheat sheets:', error)
    }
  }
})

const goHome = (): void => {
  router.push('/dashboard')
}

const isEditing = ref<boolean>(false)
const editForm = ref<EditForm>({
  name: '',
  email: '',
})

const userStats = computed<UserStats>(() => {
  const totalSheets: number = cheatSheets.value.length
  const categories: number = new Set(cheatSheets.value.map((sheet) => sheet.category)).size
  const recentSheets: CheatSheet[] = [...cheatSheets.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return {
    totalSheets,
    categories,
    recentSheets,
  }
})

const startEditing = (): void => {
  if (user.value) {
    editForm.value = {
      name: user.value.name,
      email: user.value.email,
    }
    isEditing.value = true
  }
}

const cancelEditing = (): void => {
  isEditing.value = false
  editForm.value = { name: '', email: '' }
}

const saveProfile = (): void => {
  if (!user.value) return

  // In a real app, this would make an API call to update the user
  // For demo purposes, we'll just show a success message

  toast.success('Profile updated successfully!')
  isEditing.value = false
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <main class="max-w-4xl mx-auto px-6 py-8">
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

    <!-- Profile Header -->
    <div class="bg-[var(--color-bg-secondary)] rounded-lg p-8 mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <div
            class="w-20 h-20 bg-[var(--color-accent)] rounded-full flex items-center justify-center"
          >
            <span class="text-2xl font-bold text-white">
              {{ user?.name?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-[var(--color-text-primary)]">
              {{ user?.name }}
            </h1>
            <p class="text-[var(--color-text-secondary)] mt-1">
              {{ user?.email }}
            </p>
            <p class="text-sm text-[var(--color-text-secondary)] mt-1">
              Member since {{ formatDate(user?.createdAt || '') }}
            </p>
          </div>
        </div>
        <button
          v-if="!isEditing"
          @click="startEditing"
          class="border border-[var(--color-accent)] text-[var(--color-accent)] px-6 py-2 rounded-md hover:bg-[var(--color-accent)] hover:text-white transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Profile
        </button>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div v-if="isEditing" class="bg-[var(--color-bg-secondary)] rounded-lg p-8 mb-8">
      <h2 class="text-xl font-semibold text-[var(--color-text-primary)] mb-6">Edit Profile</h2>
      <form @submit.prevent="saveProfile" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Full Name
          </label>
          <input
            id="name"
            v-model="editForm.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
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
            v-model="editForm.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          />
        </div>
        <div class="flex space-x-4">
          <button
            type="submit"
            class="border border-emerald-400 text-emerald-400 px-6 py-2 rounded-md hover:bg-emerald-400 hover:text-white transition-colors font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Changes
          </button>
          <button
            type="button"
            @click="cancelEditing"
            class="border border-rose-400 text-rose-400 px-6 py-2 rounded-md hover:bg-rose-400 hover:text-white transition-colors font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-[var(--color-bg-secondary)] rounded-lg p-6">
        <div class="flex items-center">
          <div class="p-3 bg-[var(--color-accent)] bg-opacity-10 rounded-lg">
            <svg
              class="w-6 h-6 text-[var(--color-accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-[var(--color-text-secondary)]">Total Cheat Sheets</p>
            <p class="text-2xl font-bold text-[var(--color-text-primary)]">
              {{ userStats.totalSheets }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-bg-secondary)] rounded-lg p-6">
        <div class="flex items-center">
          <div class="p-3 bg-[var(--color-accent)] bg-opacity-10 rounded-lg">
            <svg
              class="w-6 h-6 text-[var(--color-accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-[var(--color-text-secondary)]">Categories</p>
            <p class="text-2xl font-bold text-[var(--color-text-primary)]">
              {{ userStats.categories }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Cheat Sheets -->
    <div
      v-if="userStats.recentSheets.length > 0"
      class="bg-[var(--color-bg-secondary)] rounded-lg p-8"
    >
      <h2 class="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
        Recent Cheat Sheets
      </h2>
      <div class="space-y-4">
        <div
          v-for="sheet in userStats.recentSheets"
          :key="sheet.id"
          class="flex items-center justify-between p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)]"
        >
          <div>
            <h3 class="font-medium text-[var(--color-text-primary)]">{{ sheet.title }}</h3>
            <p class="text-sm text-[var(--color-text-secondary)]">{{ sheet.category }}</p>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">
              Created {{ formatDate(sheet.createdAt) }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span
              class="px-2 py-1 bg-[var(--color-accent)] bg-opacity-10 text-[var(--color-accent)] text-xs rounded-full"
            >
              {{ sheet.category }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-[var(--color-text-secondary)]">
        <svg
          class="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-lg">No cheat sheets yet</p>
        <p class="text-sm mt-2 opacity-70">Start creating your first cheat sheet!</p>
      </div>
    </div>
  </main>
</template>
