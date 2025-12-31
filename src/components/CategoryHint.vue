<script setup lang="ts">
const emit = defineEmits<{
  createCategory: []
}>()
</script>

<template>
  <div
    class="border-dashed rounded-lg p-8 text-center bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
  >
    <div class="mb-6 text-[var(--color-text-primary)]">
      <font-awesome-icon
        icon="tag"
        class="w-16 h-16 mx-auto opacity-60"
      />
    </div>
    <h3 class="font-semibold text-lg mb-3 text-[var(--color-text-primary)]">
      Create your first category
    </h3>
    <p class="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
      Before you can add cheat sheets, you need to create a category to organize them. Categories
      help you keep your cheat sheets organized and easy to find.
    </p>
    <button
      class="px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2 mx-auto"
      @click="emit('createCategory')"
    >
      <font-awesome-icon icon="plus" class="w-4 h-4" />
      Create Category
    </button>
  </div>
</template>
