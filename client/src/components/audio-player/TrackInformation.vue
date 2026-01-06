<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAudioPlayerStore } from '../../stores/audioPlayer'

const audioPlayerStore = useAudioPlayerStore()
const { track } = storeToRefs(audioPlayerStore)
</script>
<template>
  <div v-if="track" class="flex flex-col lg:flex-row gap-x-8 justify-center items-center">
    <div class="flex-1 flex justify-end">
      <img :src="track.image.url" alt="Track image" class="rounded-regular h-[50px] lg:h-[80px]" />
    </div>
    <router-link :to="`/track/${track._id}`" class="text-nowrap text-left lg:text-lg flex-1 truncate">
      {{ track.title }}
    </router-link>
  </div>
</template>
