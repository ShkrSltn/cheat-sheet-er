<script setup lang="ts">
import { useCategoryColors } from '@/composables/useCategoryColors'
import type { CategoryTabsProps } from '@/types/components'

defineProps<CategoryTabsProps>()

const emit = defineEmits<{
  'update:activeCategory': [category: string | null]
  'create-in-category': [category: string]
  'create-category': []
  'delete-category': [category: string]
}>()

const { getCategoryStyles } = useCategoryColors()

const handleDeleteCategory = (event: Event, category: string): void => {
  event.stopPropagation()
  emit('delete-category', category)
}
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 overflow-x-auto pb-2 flex-1">
        <button
          class="px-4 py-2 rounded-lg whitespace-nowrap transition-all"
          :class="
            activeCategory === null
              ? 'bg-[var(--color-bg-accent)] text-[var(--color-text-primary)] border border-[var(--color-bg-accent)]'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
          "
          @click="emit('update:activeCategory', null)"
        >
          All
          <span class="ml-2 opacity-70">({{ totalCount }})</span>
        </button>

        <button
          v-for="category in categories"
          :key="category"
          class="px-4 py-2 rounded-lg whitespace-nowrap transition-all border category-tab group/tab relative"
          :style="getCategoryStyles(category, activeCategory === category)"
          @click="emit('update:activeCategory', category)"
        >
          <span class="flex items-center gap-2">
            <span>{{ category }}</span>
            <span class="opacity-70">({{ categoryCounts[category] || 0 }})</span>
            <button
              class="opacity-0 group-hover/tab:opacity-100 transition-opacity ml-1 hover:scale-110"
              :title="`Delete ${category}`"
              @click="handleDeleteCategory($event, category)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        </button>
      </div>

      <div class="flex gap-2 flex-shrink-0">
        <button
          v-if="activeCategory && categories.length > 0"
          class="px-3 py-2 rounded-lg flex items-center gap-2 transition-all border text-sm whitespace-nowrap quick-add-btn"
          :style="getCategoryStyles(activeCategory, true)"
          :title="`Add to ${activeCategory}`"
          @click="emit('create-in-category', activeCategory)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add Sheet</span>
        </button>

        <button
          class="px-3 py-2 rounded-lg flex items-center gap-2 transition-all border text-sm bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)] hover:border-[var(--color-border-hover)] whitespace-nowrap"
          title="Create new category"
          @click="emit('create-category')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <span>New Category</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for tabs */
div::-webkit-scrollbar {
  height: 6px;
}

.category-tab:hover {
  filter: brightness(1.15);
}

.quick-add-btn:hover {
  filter: brightness(1.2);
}

button:hover {
  opacity: 0.9;
}
</style>
