<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue'

interface Props {
  waveformData: number[]
  progress: number
  width?: number
  height?: number
  waveformColor?: string
  progressColor?: string
  highlightColor?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['progressClick'])

const TARGET_CANVAS_WIDTH = props.width || 800
const CANVAS_HEIGHT = props.height || 200
const BAR_WIDTH = 4
const SPACING = 2
const waveformColor = props.waveformColor || 'rgba(0, 0, 0, 0.5)'
const progressColor = props.progressColor || 'rgba(0, 0, 0, 0.75)'
const highlightedBarColor = props.highlightColor || 'rgba(0, 0, 0, 1)'

const CANVAS_WIDTH = Math.floor(TARGET_CANVAS_WIDTH / (BAR_WIDTH + SPACING)) * (BAR_WIDTH + SPACING)

const canvasRef = useTemplateRef('canvasRef')

const NUM_BARS = CANVAS_WIDTH / (BAR_WIDTH + SPACING)
const SAMPLES_PER_BAR = props.waveformData.length / NUM_BARS

function calucalteBarHeights() {
  const heights = []

  //calucalte bar heights
  for (let i = 0; i < NUM_BARS; i++) {
    let startIndex = i === 0 ? 0 : Math.floor(i * SAMPLES_PER_BAR)

    let sum = 0
    for (let j = startIndex; j < startIndex + Math.floor(SAMPLES_PER_BAR); j++) {
      sum += props.waveformData[j]
    }
    const avgAmp = sum / Math.floor(SAMPLES_PER_BAR)

    heights.push(Math.max(avgAmp * CANVAS_HEIGHT, 1))
  }
  return heights
}

//global bar heigths variable
const barsHeights = calucalteBarHeights()
let highlightedBarIndex: number | null = null

function handleMouseMove(e: MouseEvent) {
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left

  highlightedBarIndex = Math.floor((mouseX / CANVAS_WIDTH) * NUM_BARS)
  drawWaveform()
}

function handleMouseLeave() {
  highlightedBarIndex = null
  drawWaveform()
}

function handleClick(e: MouseEvent) {
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  emit('progressClick', mouseX / CANVAS_WIDTH)
}

function drawWaveform() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  //clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  const NUM_OF_FILLED_BARS = Math.ceil(NUM_BARS * props.progress)

  //draw waveform
  for (let i = 0; i < NUM_BARS; i++) {
    //determine fill color
    ctx.fillStyle = i === highlightedBarIndex ? highlightedBarColor : i + 1 <= NUM_OF_FILLED_BARS ? progressColor : waveformColor

    let x = i * (BAR_WIDTH + SPACING)
    let height = barsHeights[i]
    let y = CANVAS_HEIGHT / 2 - height / 2

    ctx.fillRect(x, y, BAR_WIDTH, height)
  }
}

watch(
  () => props.progress,
  () => {
    drawWaveform()
  }
)

onMounted(() => {
  drawWaveform()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="CANVAS_WIDTH"
    :height="CANVAS_HEIGHT"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
    class="cursor-pointer"
  >
  </canvas>
</template>
