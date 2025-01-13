<script setup lang="ts">
defineProps<{ isLoading?: boolean; alt?: boolean }>()
</script>

<template>
  <button class="h-12 relative w-full" :class="alt ? 'base-btn-alt' : 'base-btn'">
    <div v-if="isLoading" class="scale-50 absolute inset-0">
      <div class="loader"></div>
    </div>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>
