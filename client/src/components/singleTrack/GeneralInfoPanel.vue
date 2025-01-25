<script setup lang="ts">
import PlayPauseBtn from '../PlayPauseBtn.vue'
import TrackOptionsPopover from './TrackOptionsPopover.vue'
import InteractiveWaveform from '../InteractiveWaveform.vue'
import { useAudioPlayerStore } from '../../stores/audioPlayer'
import { useAuthStore } from '../../stores/auth'
import getWaveformColors from '../../utils/getWaveformColors'
import { computed } from 'vue'

const { track } = defineProps<{ track: Track }>()
const audioPlayerStore = useAudioPlayerStore()
const authStore = useAuthStore()

async function handleWaveformClick(newProgress: number) {
  if (!audioPlayerStore.track || track._id !== audioPlayerStore.track._id) {
    audioPlayerStore.setNewTrack(track as PlayableTrack, { progress: newProgress * 100, isPaused: false })
  } else {
    audioPlayerStore.setProgress(newProgress * 100)
  }
}

const { waveformColor, progressColor, highlightColor } = getWaveformColors(track.image.averageColor.hex)

const textColor = computed(() => {
  return progressColor
})
</script>

<template>
  <div
    class="base-container p-4 flex gap-8 relative"
    :style="[
      track.image && track.image.averageColor
        ? { background: track.image.averageColor.hex, color: textColor }
        : { backgroundColor: 'var(--grey)', color: 'black' },
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
          :progress="audioPlayerStore.track?._id === track._id ? audioPlayerStore.progress / 100 : 0"
          @progress-click="handleWaveformClick"
        />
      </div>
    </div>
  </div>
</template>
