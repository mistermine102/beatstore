<script setup lang="ts">
import PlayPauseBtn from './PlayPauseBtn.vue'
defineProps<{ track: Track }>()
</script>
<template>
  <div class="grid grid-cols-4">
    <div class="flex gap-x-2">
      <img class="image-thumbnail" v-if="track.image" :src="track.image.url" alt="Track image" />
      <PlayPauseBtn :track="track"/>
      <div>
        <h2 class="whitespace-nowrap text-xl">{{ track.title }}</h2>
        <p class="text-textLightGrey" v-if="track.playable">{{ track.audio.duration.formatted }}</p>
      </div>
    </div>
    <div class="col-span-2">
      <div class="flex justify-between">
        <p v-if="track.bpm !== undefined">Bpm: {{ track.bpm || 'Unknown' }}</p>
        <p v-if="track.key !== undefined">Key: {{ track.key || 'Unknown' }}</p>
        <p v-if="track.genre !== undefined">Genre: {{ track.genre || 'Unknown' }}</p>
      </div>
    </div>
    <div></div>
  </div>
</template>
