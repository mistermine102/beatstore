<script setup lang="ts">
const { disabled = false } = defineProps<{ isLoading?: boolean; alt?: boolean; disabled?: boolean }>()
</script>

<template>
  <button class="h-12 relative w-fit" :class="[alt ? 'base-btn-alt' : 'base-btn', disabled ? 'opacity-50' : undefined]" :disabled="disabled">
    <div v-if="isLoading" class="scale-50 absolute inset-0">
      <div class="loader"></div>
    </div>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>
