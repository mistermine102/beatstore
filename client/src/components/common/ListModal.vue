<script setup lang="ts">
import BaseModal from '../base/BaseModal.vue'

defineProps<{
  isOpen: boolean
  title: string
  description?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <BaseModal :is-open="isOpen" @close="emit('close')">
    <h2 class="text-xl">{{ title }}</h2>
    <p class="text-textLightGrey mb-4">{{ description }}</p>
    <div>
      <div v-if="isLoading" class="flex justify-center mt-8">
        <div class="loader"></div>
      </div>
      <ul v-else class="flex flex-col gap-y-2">
        <slot></slot>
      </ul>
    </div>
  </BaseModal>
</template>
