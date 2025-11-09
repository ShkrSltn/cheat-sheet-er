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
      <svg
        class="w-16 h-16 mx-auto opacity-60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
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
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Create Category
    </button>
  </div>
</template>
