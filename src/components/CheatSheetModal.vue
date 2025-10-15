<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { CheatSheet } from '@/types'
import { useCheatSheetsStore } from '@/stores/cheatSheets'

interface Props {
  isOpen: boolean
  cheatSheet?: CheatSheet | null
}

const props = defineProps<Props>()
const store = useCheatSheetsStore()
const { categories } = storeToRefs(store)

interface SaveData {
  title: string
  description: string
  category: string
  content: string
}

const emit = defineEmits<{
  close: []
  save: [data: SaveData]
}>()

interface FormData {
  title: string
  description: string
  category: string
  content: string
}

const form = ref<FormData>({
  title: '',
  description: '',
  category: '',
  content: '',
})

const errors = ref<Partial<Record<keyof FormData, string>>>({})
const isEditing = ref(false)

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      errors.value = {}
      if (props.cheatSheet) {
        form.value = {
          title: props.cheatSheet.title,
          description: props.cheatSheet.description,
          category: props.cheatSheet.category,
          content: props.cheatSheet.content,
        }
        isEditing.value = true
      } else {
        form.value = {
          title: '',
          description: '',
          category: '',
          content: '',
        }
        isEditing.value = false
      }
    }
  },
)

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  } else if (form.value.title.trim().length < 3) {
    errors.value.title = 'Title must be at least 3 characters'
  } else if (form.value.title.trim().length > 100) {
    errors.value.title = 'Title must be less than 100 characters'
  }

  if (form.value.description.trim().length > 200) {
    errors.value.description = 'Description must be less than 200 characters'
  }

  if (form.value.category.trim().length > 50) {
    errors.value.category = 'Category must be less than 50 characters'
  }

  if (!form.value.content.trim()) {
    errors.value.content = 'Content is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSave = () => {
  if (!validateForm()) {
    return
  }

  const data: SaveData = {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    category: form.value.category.trim(),
    content: form.value.content.trim(),
  }

  emit('save', data)
}

const handleClose = () => {
  errors.value = {}
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
          class="w-full max-w-4xl mx-4 rounded-lg p-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] h-[85vh] flex flex-col"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-[var(--color-text-primary)]">
              {{ isEditing ? 'Edit Cheat Sheet' : 'Create Cheat Sheet' }}
            </h2>
            <button
              class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              @click="handleClose"
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

          <form @submit.prevent="handleSave" class="space-y-3 flex flex-col flex-1 overflow-hidden">
            <div class="grid grid-cols-2 gap-3 flex-shrink-0">
              <div>
                <label class="block text-xs font-medium mb-1 text-[var(--color-text-primary)]">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full rounded px-2 py-1.5 text-sm bg-[var(--color-bg-primary)] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] transition-colors"
                  :class="errors.title ? 'border-red-500' : 'border-[var(--color-border)]'"
                  placeholder="Title"
                  @input="errors.title = ''"
                />
                <p v-if="errors.title" class="text-red-500 text-xs mt-0.5">{{ errors.title }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium mb-1 text-[var(--color-text-primary)]">
                  Category
                </label>
                <input
                  v-model="form.category"
                  type="text"
                  list="categories-list"
                  class="w-full rounded px-2 py-1.5 text-sm bg-[var(--color-bg-primary)] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] transition-colors"
                  :class="errors.category ? 'border-red-500' : 'border-[var(--color-border)]'"
                  placeholder="JavaScript, CSS..."
                  @input="errors.category = ''"
                />
                <datalist id="categories-list">
                  <option v-for="category in categories" :key="category" :value="category" />
                </datalist>
                <p v-if="errors.category" class="text-red-500 text-xs mt-0.5">
                  {{ errors.category }}
                </p>
              </div>
            </div>

            <div class="flex-shrink-0">
              <label class="block text-xs font-medium mb-1 text-[var(--color-text-primary)]">
                Description
              </label>
              <input
                v-model="form.description"
                type="text"
                class="w-full rounded px-2 py-1.5 text-sm bg-[var(--color-bg-primary)] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] transition-colors"
                :class="errors.description ? 'border-red-500' : 'border-[var(--color-border)]'"
                placeholder="Brief description (optional)"
                @input="errors.description = ''"
              />
              <p v-if="errors.description" class="text-red-500 text-xs mt-0.5">
                {{ errors.description }}
              </p>
            </div>

            <div class="flex-1 flex flex-col min-h-0">
              <label class="block text-xs font-medium mb-1 text-[var(--color-text-primary)]">
                Content <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.content"
                class="flex-1 w-full rounded px-3 py-2 bg-[var(--color-bg-primary)] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] transition-colors resize-none font-mono text-sm"
                :class="errors.content ? 'border-red-500' : 'border-[var(--color-border)]'"
                placeholder="Enter cheat sheet content..."
                @input="errors.content = ''"
              />
              <p v-if="errors.content" class="text-red-500 text-xs mt-0.5">{{ errors.content }}</p>
            </div>

            <div class="flex justify-end gap-3 pt-4 flex-shrink-0">
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
                {{ isEditing ? 'Save' : 'Create' }}
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
