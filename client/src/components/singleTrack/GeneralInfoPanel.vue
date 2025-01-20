<script setup lang="ts">
import PlayPauseBtn from '../PlayPauseBtn.vue'
import TrackOptionsPopover from './TrackOptionsPopover.vue'

const { track } = defineProps<{ track: Track }>()
</script>

<template>
  <div
    class="base-container p-4 mb-8 flex gap-8 relative"
    :style="[
      track.image && track.image.averageColor
        ? // ? { background: `linear-gradient(to right bottom, ${track.image.averageColor.hex}, var(--grey))` }
          { background: track.image.averageColor.hex }
        : { backgroundColor: 'var(--grey)' },
    ]"
  >
    <div class="absolute top-4 right-4">
      <TrackOptionsPopover :track="track" />
    </div>
    <img v-if="track.image" :src="track.image.url" alt="Track" />
    <div class="py-4">
      <p class="text-xl text-textLightGrey">{{ track.author.username }}</p>
      <h2 class="text-left text-4xl">{{ track.title }}</h2>
      <div class="mt-4" v-if="track.playable">
        <div class="flex items-center gap-4 mb-2">
          <PlayPauseBtn :track="track" class="scale-150"></PlayPauseBtn>
          <img :src="track.audio.waveform.url" class="w-[800px] object-contain">
        </div>
        <p>{{ track.audio.duration.formatted }}</p>
      </div>
    </div>
  </div>
</template>
