<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useAudioPlayerStore } from '../stores/audioPlayer'
import { storeToRefs } from 'pinia'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import { PlayIcon, PauseIcon } from './icons/index.vine'

const props = defineProps<{ track: PlayableTrack }>()

const audioPlayerStore = useAudioPlayerStore()
const { track: currentlyPlayingTrack, isPaused } = storeToRefs(audioPlayerStore)

const wrapCountStream = reactive(useAsyncWrap())

// Methods
function playAudio() {
  //count stream
  if (!currentlyPlayingTrack.value || currentlyPlayingTrack.value._id !== props.track._id) {
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
  <button v-if="!isThatTrackPlaying" @click="playAudio">
    <PlayIcon />
  </button>
  <button v-else @click="pauseAudio">
    <PauseIcon />
  </button>
</template>
