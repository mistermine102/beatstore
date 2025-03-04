<script setup lang="ts">
import { useAudioPlayerStore } from '../../stores/audioPlayer'
import { Volume2Icon, VolumeXIcon } from '../icons/index.vine'
import BaseRangeInput from '../base/BaseRangeInput.vue'

const audioPlayerStore = useAudioPlayerStore()
</script>

<template>
  <div>
    <div class="flex justify-center items-center gap-4">
      <button @click="audioPlayerStore.toggleMute" class="group relative">
        <Volume2Icon v-if="audioPlayerStore.volume" class="relative transform group-hover:scale-110 transition-transform duration-150" />
        <VolumeXIcon v-else class="relative transform group-hover:scale-110 transition-transform duration-150" />
      </button>
      <BaseRangeInput :value="audioPlayerStore.volume" @change="audioPlayerStore.setVolume" />
    </div>
  </div>
</template>
