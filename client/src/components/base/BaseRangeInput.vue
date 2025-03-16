<script setup lang="ts">
import { computed } from 'vue'
import { useTemplateRef } from 'vue'

const props = defineProps<{ value: number }>()
const emit = defineEmits(['change'])

const bar = useTemplateRef('bar')

const thumbStyles = computed(() => {
  return {
    left: props.value + '%',
  }
})

const progressStyles = computed(() => {
  return {
    right: 100 - props.value + '%',
  }
})

function handlePercentageChange(e: MouseEvent) {
  if (!bar.value) return

  // Get fresh values for the bar position
  const barRect = bar.value.getBoundingClientRect()
  const leftBound = barRect.left
  const rightBound = barRect.right
  const durationBarWidth = barRect.width

  let percentage = 0

  if (e.clientX >= leftBound && e.clientX <= rightBound) {
    percentage = ((e.clientX - leftBound) / durationBarWidth) * 100
  } else if (e.clientX < leftBound) {
    percentage = 0
  } else {
    percentage = 100
  }

  emit('change', percentage)
}

function handleScrubEnter() {
  document.addEventListener('mousemove', handlePercentageChange)
  document.addEventListener('mouseup', handleScrubLeave)
}

function handleScrubLeave() {
  document.removeEventListener('mousemove', handlePercentageChange)
  document.removeEventListener('mouseup', handleScrubLeave)
}
</script>

<template>
  <div class="py-4 range-input-bar-container cursor-pointer" @click="handlePercentageChange" @mousedown.prevent="handleScrubEnter" ref="bar">
    <div class="range-input-bar min-w-[100px]">
      <div class="range-input-thumb pointer-events-none" :style="thumbStyles"></div>
      <div class="range-input-progress" :style="progressStyles"></div>
    </div>
  </div>
</template>
