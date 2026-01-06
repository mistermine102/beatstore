<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '../../stores/toast'

const toastStore = useToastStore()

const bgColor = computed(() => {
  switch (toastStore.type) {
    case 'error':
      return 'border-red-500'
    case 'success':
      return 'border-green-500'
    default:
      return 'bg-grey border-white/[0.02]'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="transform -translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-2 opacity-0"
  >
    <div v-if="toastStore.isOpen" class="z-50 fixed flex justify-center top-2 left-0 right-0 pointer-events-none">
      <div
        @click="toastStore.close"
        class="pointer-events-auto px-6 py-4 rounded-regular border cursor-pointer bg-background"
        :class="bgColor"
      >
        <h3>{{ toastStore.title }}</h3>
        <p v-if="toastStore.message" class="text-textLightGrey">{{ toastStore.message }}</p>
      </div>
    </div>
  </Transition>
</template>
