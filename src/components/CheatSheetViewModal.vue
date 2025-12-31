<script setup lang="ts">
import CodeHighlight from './CodeHighlight.vue'
import { useCategoryColors } from '@/composables/useCategoryColors'
import type { CheatSheetViewModalProps } from '@/types/components'

defineProps<CheatSheetViewModalProps>()

const emit = defineEmits<{
  close: []
}>()

const { getCategoryStyles } = useCategoryColors()

const formatDate = (isoDate: string): string => {
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
              <font-awesome-icon icon="times" class="w-6 h-6" />
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
              <font-awesome-icon icon="tag" class="w-4 h-4" />
              {{ cheatSheet.category }}
            </span>
            <span class="flex items-center gap-2 text-[var(--color-text-primary)] opacity-70">
              <font-awesome-icon icon="clock" class="w-4 h-4" />
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
