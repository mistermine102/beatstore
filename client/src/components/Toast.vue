<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '../stores/toast'

const toastStore = useToastStore()

const borderColorStyle = computed(() => {
  switch (toastStore.type) {
    case 'info':
      return 'border-blue-500'
    case 'error':
      return 'border-red-500'
    case 'success':
      return 'border-green-500'
  }
})
</script>

<template>
  <div v-if="toastStore.isOpen" class="z-[2] fixed flex justify-center top-2 left-0 right-0">
    <div class="bg-grey p-4 w-fit px-16 rounded-regular border-l-4 shadow-xl" :class="borderColorStyle">
      <div class="flex justify-between items-center">
        <h3>{{ toastStore.title }}</h3>
      </div>
      <p class=" text-textLightGrey">{{ toastStore.message }}</p>
    </div>
  </div>
</template>
