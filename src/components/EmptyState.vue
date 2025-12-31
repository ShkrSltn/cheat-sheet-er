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
      <font-awesome-icon icon="plus" class="w-12 h-12 mx-auto" />
    </div>
    <h3 class="font-medium mb-2 text-[var(--color-text-primary)]">Create new cheat sheet</h3>
    <p class="text-sm text-[var(--color-text-primary)] opacity-70">Click to add</p>
  </button>
</template>
