<script setup lang="ts">
import PlayPauseBtn from './PlayPauseBtn.vue'
defineProps<{ track: Track }>()
</script>
<template>
  <div class="grid grid-cols-3 gap-x-4">
    <div class="flex gap-x-4">
      <img class="image-thumbnail" v-if="track.image" :src="track.image.url" alt="Track image" />
      <div>
        <h2 class="whitespace-nowrap text-xl">{{ track.title }}</h2>
        <p class="text-textLightGrey" v-if="track.playable">{{ track.audio.duration.formatted }}</p>
        <PlayPauseBtn v-if="track.playable" :track="track" />
      </div>
    </div>
    <div class="text-textLightGrey flex flex-col gap-y-2">
      <p v-if="track.bpm !== undefined">Bpm: {{ track.bpm || 'Unknown' }}</p>
      <p v-if="track.key !== undefined">Key: {{ track.key || 'Unknown' }}</p>
      <p v-if="track.genre !== undefined">Genre: {{ track.genre || 'Unknown' }}</p>
    </div>
    <div>
      <p>{{ track.author.username }}</p>
      <div>
        {{ track.totalLikes }}
      </div>
      <div v-if="track.totalStreams !== undefined">
        {{ track.totalStreams }}
      </div>
    </div>
  </div>
</template>
