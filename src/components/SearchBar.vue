<script setup lang="ts">
interface Props {
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="mb-8">
    <div class="relative max-w-md">
      <input
        :value="modelValue"
        type="text"
        placeholder="Search cheat sheets..."
        class="w-full rounded-lg px-4 py-3 pl-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-border-hover)] transition-colors"
        @input="handleInput"
      />
      <svg
        class="absolute left-3 top-3.5 w-4 h-4 text-[var(--color-text-secondary)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>
</template>
