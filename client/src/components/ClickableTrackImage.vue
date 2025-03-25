<script setup lang="ts">
import PlayPauseBtn from './PlayPauseBtn.vue';

defineProps<{ track: PlayableTrack }>()
</script>

<template>
  <div class="relative rounded-regular group">
    <PlayPauseBtn :track="track" class="absolute z-[3] opacity-0 group-hover:opacity-100 transition-opacity" />
    <div class="w-full h-full bg-black/5 absolute z-[2] rounded-regular group-hover:bg-black/50 transition-colors"></div>
    <img :src="track.image.url" alt="" class="absolute h-full w-full object-cover z-[1] rounded-regular" />
  </div>
</template>
