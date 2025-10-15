<script setup lang="ts">
const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <button
    class="border-dashed rounded-lg p-6 text-center bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors w-full"
    @click="emit('create')"
  >
    <div class="mb-4 text-[var(--color-text-primary)]">
      <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </div>
    <h3 class="font-medium mb-2 text-[var(--color-text-primary)]">Create new cheat sheet</h3>
    <p class="text-sm text-[var(--color-text-primary)] opacity-70">Click to add</p>
  </button>
</template>
