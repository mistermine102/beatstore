<script setup lang="ts">
import { useAudioPlayerStore } from '../../stores/audioPlayer'
import { PlayIcon, PauseIcon } from '../icons/index.vine'
import BaseRangeInput from '../base/BaseRangeInput.vue'
import moment from 'moment'

const audioPlayerStore = useAudioPlayerStore()

function formatTime(seconds: number) {
  return moment.utc(seconds * 1000).format('mm:ss')
}
</script>

<template>
  <div class="col-span-2">
    <div class="flex flex-col items-center">
      <button @click="audioPlayerStore.toggle" class="clickable-icon">
        <PlayIcon v-if="audioPlayerStore.isPaused" :fill="true" />
        <PauseIcon v-else :fill="true" />
      </button>
      <div class="flex items-center w-full lg:w-auto">
        <span class="w-[50px] flex justify-center">{{ formatTime(audioPlayerStore.currentTime) }}</span>
        <div class="w-full lg:w-[500px]">
          <BaseRangeInput :value="audioPlayerStore.progress" @change="audioPlayerStore.setProgress" />
        </div>
        <span class="w-[50px] flex justify-center">{{ formatTime(audioPlayerStore.duration) }}</span>
      </div>
    </div>
  </div>
</template>
