<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import type { CheatSheet } from '@/types'
import CodeHighlight from './CodeHighlight.vue'
import { useCheatSheetsStore } from '@/stores/cheatSheets'

const toast = useToast()

interface Props {
  cheatSheet: CheatSheet
  totalCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  view: [id: string]
  delete: [id: string]
}>()

const store = useCheatSheetsStore()
const { categories } = storeToRefs(store)

const isEditing = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
const editForm = ref({
  title: '',
  description: '',
  category: '',
  content: '',
})

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

const startEdit = () => {
  editForm.value = {
    title: props.cheatSheet.title,
    description: props.cheatSheet.description,
    category: props.cheatSheet.category,
    content: props.cheatSheet.content,
  }
  isEditing.value = true

  // Adjust height after DOM update
  setTimeout(() => {
    adjustTextareaHeight()
  }, 0)
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveEdit = () => {
  if (!editForm.value.title.trim() || !editForm.value.content.trim()) {
    toast.warning('Title and content are required')
    return
  }

  store.updateCheatSheet(props.cheatSheet.id, {
    title: editForm.value.title.trim(),
    description: editForm.value.description.trim(),
    category: editForm.value.category.trim(),
    content: editForm.value.content.trim(),
  })

  isEditing.value = false
  toast.success('Cheat sheet updated!')
}

const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(props.cheatSheet.content)
    toast.success('Content copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    toast.error('Failed to copy content')
  }
}

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Calculate content size based on character count and lines
const contentSize = computed(() => {
  const content = props.cheatSheet.content
  const charCount = content.length
  const lineCount = content.split('\n').length

  // Small: less than 200 chars or 5 lines
  if (charCount < 200 || lineCount < 5) return 'small'

  // Medium: 200-600 chars or 5-15 lines
  if (charCount < 600 || lineCount < 15) return 'medium'

  // Large: 600-1200 chars or 15-30 lines
  if (charCount < 1200 || lineCount < 30) return 'large'

  // Extra large: more than 1200 chars or 30 lines
  return 'xlarge'
})

// Dynamic grid column span based on content size and total count
const gridColumnClass = computed(() => {
  const size = contentSize.value

  // Single item - full width
  if (props.totalCount === 1) return 'col-span-full'

  // Two items - smart distribution
  if (props.totalCount === 2) {
    if (size === 'xlarge') return 'col-span-full lg:col-span-9'
    if (size === 'large') return 'col-span-full lg:col-span-8'
    if (size === 'medium') return 'col-span-full lg:col-span-6'
    return 'col-span-full lg:col-span-3' // small takes 25%
  }

  // Three items - distribute based on size
  if (props.totalCount === 3) {
    if (size === 'xlarge') return 'col-span-full lg:col-span-8'
    if (size === 'large') return 'col-span-full lg:col-span-6'
    if (size === 'medium') return 'col-span-full lg:col-span-4'
    return 'col-span-full lg:col-span-3'
  }

  // Many items - optimized distribution
  if (size === 'xlarge') return 'col-span-full lg:col-span-9 xl:col-span-8'
  if (size === 'large') return 'col-span-full md:col-span-6 lg:col-span-6'
  if (size === 'medium') return 'col-span-full md:col-span-6 lg:col-span-4'
  return 'col-span-full md:col-span-4 lg:col-span-3' // small
})
</script>

<template>
  <div
    :class="[
      'rounded-lg p-6 bg-[var(--color-bg-secondary)] border transition-colors group h-fit',
      isEditing
        ? 'border-[var(--color-bg-accent)]'
        : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
      gridColumnClass,
    ]"
  >
    <!-- View Mode -->
    <template v-if="!isEditing">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-lg font-medium text-[var(--color-text-primary)] flex-1 break-words">
          {{ cheatSheet.title }}
        </h3>
        <div class="flex gap-2 ml-2 flex-shrink-0">
          <button
            class="text-[var(--color-text-primary)] hover:opacity-70 transition-opacity"
            aria-label="Copy"
            @click="copyContent"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            class="text-[var(--color-text-primary)] hover:opacity-70 transition-opacity"
            aria-label="Edit"
            @click="startEdit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            class="text-[var(--color-text-primary)] hover:text-red-400 transition-colors"
            aria-label="Delete"
            @click="emit('delete', cheatSheet.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <p
        v-if="cheatSheet.description"
        class="text-sm mb-3 text-[var(--color-text-primary)] opacity-80 line-clamp-1"
      >
        {{ cheatSheet.description }}
      </p>

      <div
        class="mb-4 p-3 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs overflow-auto"
      >
        <CodeHighlight :code="cheatSheet.content" />
      </div>

      <div
        class="flex items-center justify-between text-xs text-[var(--color-text-primary)] opacity-70"
      >
        <span>{{ formatDate(cheatSheet.updatedAt) }}</span>
        <span
          v-if="cheatSheet.category"
          class="px-2 py-1 rounded text-xs bg-[var(--color-bg-accent)] text-[var(--color-text-primary)]"
        >
          {{ cheatSheet.category }}
        </span>
      </div>
    </template>

    <!-- Edit Mode -->
    <template v-else>
      <div class="space-y-2">
        <div>
          <label class="block text-xs font-medium mb-1 text-[var(--color-text-primary)]">
            Title
          </label>
          <input
            v-model="editForm.title"
            type="text"
            placeholder="Title"
            class="w-full rounded px-2 py-1.5 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
          />
        </div>

        <div>
          <label class="block text-xs font-medium mb-1 text-[var(--color-text-primary)]">
            Category
          </label>
          <input
            v-model="editForm.category"
            type="text"
            list="edit-categories-list"
            placeholder="Category"
            class="w-full rounded px-2 py-1.5 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
          />
          <datalist id="edit-categories-list">
            <option v-for="category in categories" :key="category" :value="category" />
          </datalist>
        </div>

        <div>
          <label class="block text-xs font-medium mb-1 text-[var(--color-text-primary)]">
            Description
          </label>
          <input
            v-model="editForm.description"
            type="text"
            placeholder="Description (optional)"
            class="w-full rounded px-2 py-1.5 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
          />
        </div>

        <div>
          <label class="block text-xs font-medium mb-1 text-[var(--color-text-primary)]">
            Content
          </label>
          <textarea
            ref="textareaRef"
            v-model="editForm.content"
            placeholder="Content"
            class="w-full rounded px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono text-xs resize-none overflow-hidden"
            @input="adjustTextareaHeight"
          />
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:opacity-80 transition-opacity"
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded bg-[var(--color-bg-accent)] text-[var(--color-text-primary)] hover:opacity-80 transition-opacity"
            @click="saveEdit"
          >
            Save
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
