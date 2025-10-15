<script setup lang="ts">
defineEmits<{
  create: []
}>()
</script>

<template>
  <header class="border-b border-[var(--color-border)]">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-light text-[var(--color-text-primary)]">Cheat Sheets</h1>
          <p class="text-sm mt-1 text-[var(--color-text-primary)] opacity-80">
            Manage your cheat sheets
          </p>
        </div>
        <button
          class="px-4 py-2 rounded-lg bg-[var(--color-bg-accent)] text-[var(--color-text-primary)] border border-[var(--color-bg-accent)] hover:opacity-80 transition-opacity"
          @click="$emit('create')"
        >
          + Create
        </button>
      </div>
    </div>
  </header>
</template>
