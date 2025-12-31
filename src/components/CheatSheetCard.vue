<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import CodeHighlight from './CodeHighlight.vue'
import { useCheatSheetsStore } from '@/stores/cheatSheets'
import { useCategoryColors } from '@/composables/useCategoryColors'
import type { CheatSheetCardProps } from '@/types/components'
import type { CheatSheetFormData } from '@/types/components'

const toast = useToast()
const { getCategoryStyles, getCategoryColor } = useCategoryColors()

const props = defineProps<CheatSheetCardProps>()

const emit = defineEmits<{
  view: [id: string]
  delete: [id: string]
}>()

const store = useCheatSheetsStore()
const { categories } = storeToRefs(store)

const isEditing = ref<boolean>(false)
const textareaRef = ref<HTMLTextAreaElement>()
const editForm = ref<CheatSheetFormData>({
  title: '',
  description: '',
  category: '',
  content: '',
})

const adjustTextareaHeight = (): void => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

const startEdit = (): void => {
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

const cancelEdit = (): void => {
  isEditing.value = false
}

const saveEdit = (): void => {
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

const copyContent = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(props.cheatSheet.content)
    toast.success('Content copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    toast.error('Failed to copy content')
  }
}

const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Calculate content size based on character count and lines
const contentSize = computed<'small' | 'medium' | 'large' | 'xlarge'>(() => {
  const content: string = props.cheatSheet.content
  const charCount: number = content.length
  const lineCount: number = content.split('\n').length

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

// Get category colors for card styling
const cardColors = computed(() => {
  if (!props.cheatSheet.category) return null
  return getCategoryColor(props.cheatSheet.category)
})

const cardStyle = computed(() => {
  if (!cardColors.value) return {}
  return {
    borderColor: cardColors.value.border,
  }
})

const titleStyle = computed(() => {
  if (!cardColors.value) return {}
  return {
    color: cardColors.value.text,
  }
})
</script>

<template>
  <div
    :class="[
      'rounded-lg p-6 bg-[var(--color-bg-secondary)] border transition-colors group h-fit',
      isEditing ? 'border-[var(--color-bg-accent)]' : '',
      gridColumnClass,
    ]"
    :style="!isEditing ? cardStyle : {}"
  >
    <!-- View Mode -->
    <template v-if="!isEditing">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-lg font-medium flex-1 break-words transition-colors" :style="titleStyle">
          {{ cheatSheet.title }}
        </h3>
        <div class="flex gap-2 ml-2 flex-shrink-0">
          <button
            class="text-[var(--color-text-primary)] hover:opacity-70 transition-opacity"
            aria-label="Copy"
            @click="copyContent"
          >
            <font-awesome-icon icon="copy" class="w-4 h-4" />
          </button>
          <button
            class="text-[var(--color-text-primary)] hover:opacity-70 transition-opacity"
            aria-label="Edit"
            @click="startEdit"
          >
            <font-awesome-icon icon="pen" class="w-4 h-4" />
          </button>
          <button
            class="text-[var(--color-text-primary)] hover:text-red-400 transition-colors"
            aria-label="Delete"
            @click="emit('delete', cheatSheet.id)"
          >
            <font-awesome-icon icon="trash" class="w-4 h-4" />
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
          class="px-2 py-1 rounded text-xs font-medium border transition-all category-tag"
          :style="getCategoryStyles(cheatSheet.category)"
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

.category-tag {
  opacity: 1 !important;
}
</style>
