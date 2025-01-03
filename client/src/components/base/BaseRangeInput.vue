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

function handleMouseMove(e: MouseEvent) {
  if (!bar.value) return

  let percentage = 0

  const leftBound = bar.value.offsetLeft
  const rightBound = bar.value.offsetLeft + bar.value.offsetWidth
  const durationBarWidth = bar.value.offsetWidth

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
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleScrubLeave)
}

function handleScrubLeave() {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleScrubLeave)
}
</script>

<template>
  <div class="py-4 range-input-bar-container" @mousedown.prevent="handleScrubEnter" ref="bar">
    <div class="range-input-bar min-w-[100px]">
      <div class="range-input-thumb" @mousedown.prevent="handleScrubEnter" :style="thumbStyles"></div>
      <div class="range-input-progress" :style="progressStyles"></div>
    </div>
  </div>
</template>
