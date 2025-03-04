<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useAudioPlayerStore } from '../stores/audioPlayer'
import { storeToRefs } from 'pinia'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import { PlayIcon, PauseIcon } from './icons/index.vine'

const props = defineProps<{ track: PlayableTrack; buttonClass?: string; iconSize?: number }>()

const audioPlayerStore = useAudioPlayerStore()
const { track: currentlyPlayingTrack, isPaused } = storeToRefs(audioPlayerStore)

const wrapCountStream = reactive(useAsyncWrap())

function playAudio() {
  //count stream
  if ((!currentlyPlayingTrack.value || currentlyPlayingTrack.value._id !== props.track._id) && props.track.verified) {
    wrapCountStream.run(async () => {
      await appApi.post(`/tracks/${props.track._id}/stream`)
    })
  }

  //set new track to audio player if new track is played
  if (!currentlyPlayingTrack.value || currentlyPlayingTrack.value._id !== props.track._id) {
    audioPlayerStore.setNewTrack(props.track)
  }
  //play audio
  audioPlayerStore.toggle()
}

function pauseAudio() {
  audioPlayerStore.toggle()
}

// Computed
const isThatTrackPlaying = computed(() => {
  return currentlyPlayingTrack.value && currentlyPlayingTrack.value._id === props.track._id && !isPaused.value
})
</script>

<template>
  <button
    v-if="!isThatTrackPlaying"
    @click="playAudio"
    class="play-pause-btn flex justify-center items-center gap-x-1 transition-all duration-150 w-full h-full"
    :class="buttonClass"
  >
    <PlayIcon :fill="true" :size="iconSize" />
    <span class="play-pause-text">Play</span>
  </button>
  <button
    v-else
    @click="pauseAudio"
    class="play-pause-btn flex justify-center items-center gap-x-1 transition-all duration-150 w-full h-full"
    :class="buttonClass"
  >
    <PauseIcon :fill="true" :size="iconSize" />
    <span class="play-pause-text">Pause</span>
  </button>
</template>
