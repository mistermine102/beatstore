<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-40">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80" @click="$emit('close')"></div>
        <!-- Modal -->
        <Transition name="modal">
          <div class="modal-body bg-background w-[90%] sm:w-[500px] sm:min-h-[300px] relative z-10 rounded-xl p-8">
            <slot></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> 