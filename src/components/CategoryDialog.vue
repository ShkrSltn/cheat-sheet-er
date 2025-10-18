<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  isOpen: boolean
  existingCategories: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [category: string]
}>()

const categoryName = ref('')
const error = ref('')

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      categoryName.value = ''
      error.value = ''
    }
  },
)

const handleSave = () => {
  const trimmed = categoryName.value.trim()

  if (!trimmed) {
    error.value = 'Category name is required'
    return
  }

  if (trimmed.length < 2) {
    error.value = 'Category name must be at least 2 characters'
    return
  }

  if (trimmed.length > 30) {
    error.value = 'Category name must be less than 30 characters'
    return
  }

  if (props.existingCategories.includes(trimmed)) {
    error.value = 'This category already exists'
    return
  }

  emit('save', trimmed)
  categoryName.value = ''
  error.value = ''
}

const handleClose = () => {
  categoryName.value = ''
  error.value = ''
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        @click="handleClose"
      >
        <div
          class="w-full max-w-md mx-4 rounded-lg p-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">
              Create New Category
            </h2>
            <button
              class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              @click="handleClose"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSave">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
                Category Name
              </label>
              <input
                v-model="categoryName"
                type="text"
                placeholder="e.g. JavaScript, Python, CSS..."
                class="w-full rounded px-3 py-2 bg-[var(--color-bg-primary)] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] transition-colors"
                :class="error ? 'border-red-500' : 'border-[var(--color-border)]'"
                autofocus
                @input="error = ''"
              />
              <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
            </div>

            <div class="flex justify-end gap-3">
              <button
                type="button"
                class="px-4 py-2 rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:opacity-80 transition-opacity"
                @click="handleClose"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-[var(--color-bg-accent)] text-[var(--color-text-primary)] border border-[var(--color-bg-accent)] hover:opacity-80 transition-opacity"
              >
                Create
              </button>
            </div>
          </form>
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
