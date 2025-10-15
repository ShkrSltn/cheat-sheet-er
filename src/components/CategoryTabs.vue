<script setup lang="ts">
interface Props {
  categories: string[]
  activeCategory: string | null
  totalCount: number
  categoryCounts: Record<string, number>
}

defineProps<Props>()

const emit = defineEmits<{
  'update:activeCategory': [category: string | null]
}>()
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center gap-2 overflow-x-auto pb-2">
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
        class="px-4 py-2 rounded-lg whitespace-nowrap transition-all"
        :class="
          activeCategory === category
            ? 'bg-[var(--color-bg-accent)] text-[var(--color-text-primary)] border border-[var(--color-bg-accent)]'
            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
        "
        @click="emit('update:activeCategory', category)"
      >
        {{ category }}
        <span class="ml-2 opacity-70">({{ categoryCounts[category] || 0 }})</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for tabs */
div::-webkit-scrollbar {
  height: 6px;
}
</style>
