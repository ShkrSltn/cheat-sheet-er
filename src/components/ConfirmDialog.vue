<script setup lang="ts">
import type { ConfirmDialogProps } from '@/types/components'

withDefaults(defineProps<ConfirmDialogProps>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  isDanger: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click="emit('cancel')"
      >
        <div
          class="w-full max-w-md mx-4 rounded-lg p-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
          @click.stop
        >
          <h3 class="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">
            {{ title }}
          </h3>
          <p class="text-sm mb-6 text-[var(--color-text-primary)] opacity-80">
            {{ message }}
          </p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:opacity-80 transition-opacity"
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              class="px-4 py-2 rounded-lg text-[var(--color-text-primary)] border transition-opacity hover:opacity-80"
              :class="
                isDanger
                  ? 'bg-red-600 border-red-600'
                  : 'bg-[var(--color-bg-accent)] border-[var(--color-bg-accent)]'
              "
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
