<script setup lang="ts">
import { computed } from 'vue'
import { useAudioPlayerStore } from '../stores/audioPlayer'
import { storeToRefs } from 'pinia'
import appApi from '../api/appApi'
import useAsyncWrap from '../hooks/useAsyncWrap'
import { PlayIcon, PauseIcon } from './icons/index.vine'

const props = defineProps<{ track: Track }>()

const audioPlayerStore = useAudioPlayerStore()
const { track: currentlyPlayingTrack, isPaused } = storeToRefs(audioPlayerStore)
const wrapCountStream = useAsyncWrap()

// Methods
function playAudio() {
  //play audio
  audioPlayerStore.track = props.track
  audioPlayerStore.isPaused = false

  //count stream
  if (!currentlyPlayingTrack.value || currentlyPlayingTrack.value._id !== props.track._id) {
    let trackUrl = ''

    switch (props.track.type) {
      case 'beat':
        trackUrl = '/beats'
        break
      case 'sample':
        trackUrl = '/samples'
        break
      default:
        break
    }

    const requestUrl = trackUrl + '/' + props.track._id + '/stream'

    wrapCountStream.run(async () => {
      await appApi.post(requestUrl)
    })
  }
}

function pauseAudio() {
  audioPlayerStore.isPaused = true
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
