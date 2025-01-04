<script setup lang="ts">
import { useAudioPlayerStore } from '../../stores/audioPlayer'
import { Volume2Icon, VolumeXIcon } from '../icons/index.vine'
import BaseRangeInput from '../base/BaseRangeInput.vue'

const audioPlayerStore = useAudioPlayerStore()
</script>

<template>
  <div>
    <div class="flex justify-center items-center gap-4">
      <button @click="audioPlayerStore.toggleMute">
        <Volume2Icon v-if="audioPlayerStore.volume" />
        <VolumeXIcon v-else />
      </button>
      <BaseRangeInput :value="audioPlayerStore.volume" @change="audioPlayerStore.setVolume" />
    </div>
  </div>
</template>
