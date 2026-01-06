<script setup lang="ts">
import Toast from './components/common/Toast.vue'
import TheAudioPlayer from './components/common/TheAudioPlayer.vue'
import { useAudioPlayerStore } from './stores/audioPlayer'

const audioPlayerStore = useAudioPlayerStore()
</script>

<template>
  <Toast />
  <TheAudioPlayer v-if="audioPlayerStore.track" />
  <div class="min-h-[100vh] bg-background flex flex-col justify-between" :class="audioPlayerStore.track ? 'mb-[100px]' : ''">
    <RouterView />
  </div>
</template>
