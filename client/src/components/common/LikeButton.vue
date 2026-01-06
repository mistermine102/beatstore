<script setup lang="ts">
import { HeartIcon } from '../icons/index.vine'
import { ref } from 'vue'

interface Props {
  likes: number
  isLiked?: boolean
}

withDefaults(defineProps<Props>(), {
  isLiked: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const isAnimating = ref(false)

function handleClick() {
  isAnimating.value = true
  emit('click')
  
  // Reset animation state after animation completes
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}
</script>

<template>
  <button class="w-fit like-button" @click="handleClick">
    <div class="flex items-center gap-2">
      <HeartIcon 
        :fill="isLiked"
        :class="[
          'transition-all duration-150 ease-out shrink-0 like-button__icon',
          isAnimating && 'animate-like',
          isLiked ? 'text-primary' : 'text-iconLightGrey'
        ]"
      />
      <span class="text-sm text-textLightGrey like-button__text transition-colors duration-150">
        {{ likes }}
      </span>
    </div>
  </button>
</template>

<style scoped>
.like-button:hover .like-button__icon {
  color: var(--primary);
  transform: scale(1.1);
}

.like-button:hover .like-button__text {
  color: var(--primary);
}
</style> 
