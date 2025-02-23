<script setup lang="ts">
import PlayPauseBtn from '../PlayPauseBtn.vue'
import TrackOptionsPopover from './TrackOptionsPopover.vue'
import InteractiveWaveform from '../InteractiveWaveform.vue'
import { useAuthStore } from '../../stores/auth'
import getWaveformColors from '../../utils/getWaveformColors'
import useInteractiveWafeform from '../../composables/useInteractiveWafeform'
import { computed } from 'vue'
import { useCssVar } from '@vueuse/core'

const { track } = defineProps<{ track: Track }>()
const authStore = useAuthStore()

const { handleWaveformClick, waveformProgress } = useInteractiveWafeform(track)

const colors = {
  waveformColor: useCssVar('--darkGrey').value,
  progressColor: useCssVar('--primary').value,
  highlightColor: useCssVar('--darkPrimary').value,
}

if (track.image.averageColor) {
  Object.assign(colors, getWaveformColors(track.image.averageColor.hex))
}

const { waveformColor, progressColor, highlightColor } = colors

const textColor = computed(() => {
  return progressColor
})
</script>

<template>
  <div
    class="base-container p-4 flex gap-8 relative"
    :style="[
      track.image.averageColor ? { background: track.image.averageColor.hex, color: textColor } : { backgroundColor: 'var(--grey)', color: 'white' },
    ]"
  >
    <div v-if="track.author._id === authStore.user?._id" class="absolute top-4 right-4">
      <TrackOptionsPopover :track="track" />
    </div>
    <img v-if="track.image" :src="track.image.url" alt="Track" class="object-contain" />
    <div class="py-4">
      <p class="text-xl">{{ track.author.username }}</p>
      <h2 class="text-left text-5xl">{{ track.title }}</h2>
      <div class="mt-4" v-if="track.playable">
        <div class="flex items-center gap-4 mb-2">
          <PlayPauseBtn :track="track" class="scale-150"></PlayPauseBtn>
        </div>
        <p>{{ track.audio.duration.formatted }}</p>
        <InteractiveWaveform
          :waveform-color="waveformColor"
          :progress-color="progressColor"
          :highlight-color="highlightColor"
          :waveform-data="track.audio.waveform.samples"
          :progress="waveformProgress"
          @progress-click="handleWaveformClick"
        />
      </div>
    </div>
  </div>
</template>
