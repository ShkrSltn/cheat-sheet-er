<script setup lang="ts">
import type { CheatSheet } from '@/types'
import CodeHighlight from './CodeHighlight.vue'
import { useCategoryColors } from '@/composables/useCategoryColors'

interface Props {
  isOpen: boolean
  cheatSheet: CheatSheet | null
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { getCategoryStyles } = useCategoryColors()

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen && cheatSheet"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click="emit('close')"
      >
        <div
          class="w-full max-w-4xl mx-4 rounded-lg p-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="flex items-start justify-between mb-6">
            <div class="flex-1">
              <h2 class="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                {{ cheatSheet.title }}
              </h2>
              <p
                v-if="cheatSheet.description"
                class="text-sm text-[var(--color-text-primary)] opacity-80"
              >
                {{ cheatSheet.description }}
              </p>
            </div>
            <button
              class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors ml-4"
              @click="emit('close')"
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

          <div class="mb-6">
            <div
              class="p-4 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm overflow-auto"
            >
              <CodeHighlight :code="cheatSheet.content" />
            </div>
          </div>

          <div class="flex items-center gap-4 pt-4 border-t border-[var(--color-border)] text-sm">
            <span
              v-if="cheatSheet.category"
              class="px-3 py-1.5 rounded-lg font-medium border transition-all category-badge flex items-center gap-2"
              :style="getCategoryStyles(cheatSheet.category)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {{ cheatSheet.category }}
            </span>
            <span class="flex items-center gap-2 text-[var(--color-text-primary)] opacity-70">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ formatDate(cheatSheet.updatedAt) }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
