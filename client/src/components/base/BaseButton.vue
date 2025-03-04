<script setup lang="ts">
import { computed } from 'vue'

type ButtonSize = 'small' | 'medium' | 'large'

const props = defineProps<{
  isLoading?: boolean
  alt?: boolean
  disabled?: boolean
  size?: ButtonSize
}>()

// Use computed for reactive values with defaults
const buttonSize = computed(() => props.size || 'medium')
const isDisabled = computed(() => props.disabled || false)

const sizeClasses = {
  small: 'h-8 px-4 py-1 text-sm',
  medium: 'h-12 px-6 py-2',
  large: 'h-14 px-8 py-3 text-lg',
}

const scaleValues = {
  small: 0.4,
  medium: 0.5,
  large: 0.6,
}
</script>

<template>
  <button
    class="w-fit relative transition-all duration-150 ease-in-out rounded-regular inline-flex items-center justify-center origin-center hover:-translate-y-[1px] will-change-transform"
    :class="[
      isDisabled ? 'opacity-50 cursor-not-allowed' : undefined,
      sizeClasses[buttonSize],
      alt ? 'bg-darkGrey border border-white/[0.02] hover:border-white/[0.1]' : 'bg-primary hover:bg-darkPrimary border border-transparent',
    ]"
    :disabled="isDisabled"
  >
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center" :style="{ transform: `scale(${scaleValues[buttonSize]})` }">
      <div class="loader"></div>
    </div>
    <span :class="{ 'opacity-0': isLoading }" class="whitespace-nowrap">
      <slot></slot>
    </span>
  </button>
</template>
