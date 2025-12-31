<script setup lang="ts">
import { AppButton } from '@/components/shared'
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
            <AppButton
              variant="secondary"
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </AppButton>
            <AppButton
              :variant="isDanger ? 'rose' : 'primary'"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </AppButton>
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
