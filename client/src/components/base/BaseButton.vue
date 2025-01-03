<script setup lang="ts">
defineProps<{ isLoading?: boolean }>()
</script>

<template>
  <button class="base-btn h-12 relative w-full">
    <div v-if="isLoading" class="scale-50 absolute inset-0">
      <div class="loader"></div>
    </div>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>
