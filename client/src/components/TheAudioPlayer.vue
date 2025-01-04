<!-- <script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import BaseRangeInput from './base/BaseRangeInput.vue'
import { useAudioPlayerStore } from '../stores/audioPlayer'
import { storeToRefs } from 'pinia'
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from './icons/index.vine'

// State
const audio = ref<HTMLAudioElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(25)
const previousVolume = ref(0)
const percentage = ref(0)

// Pinia Store
const audioPlayerStore = useAudioPlayerStore()
const { track, isPaused } = storeToRefs(audioPlayerStore)

// Functions
function playAudio() {
  audioPlayerStore.isPaused = false
}

function pauseAudio() {
  audioPlayerStore.isPaused = true
}

function handlePercentageChange(newPercentage: number) {
  currentTime.value = (duration.value * newPercentage) / 100
  changeCurrentTime()
}

function changeCurrentTime() {
  if (audio.value) {
    audio.value.currentTime = currentTime.value
    percentage.value = (currentTime.value / duration.value) * 100
    if (!isPaused.value) {
      audio.value.pause()
      setTimeout(() => audio.value?.play(), 300)
    }
  }
}

function changeVolume(newVolume: number) {
  volume.value = newVolume

  if (audio.value) {
    audio.value.volume = Math.pow(newVolume / 10, 2) / 100
  }
}

function toggleMute() {
  if (volume.value !== 0) {
    previousVolume.value = volume.value
    changeVolume(0)
  } else {
    changeVolume(previousVolume.value)
  }
}

// Computed
const currentTimeInMinutes = computed(() => {
  const minutes = Math.floor(currentTime.value / 60)
  const seconds = (currentTime.value % 60).toFixed(0).padStart(2, '0')
  return `${minutes}:${seconds}`
})

const durationInMinutes = computed(() => {
  const minutes = Math.floor(duration.value / 60)
  const seconds = (duration.value % 60).toFixed(0).padStart(2, '0')
  return `${minutes}:${seconds}`
})

// Watchers
watch(track, newTrack => {
  if (newTrack && audio.value && newTrack.playable) {
    audio.value.src = newTrack.audio.url
    audio.value.play()
  }
})

watch(isPaused, newIsPaused => {
  if (audio.value) {
    if (newIsPaused) {
      audio.value.pause()
    } else {
      audio.value.play()
    }
  }
})

// Hooks
onMounted(() => {
  if (!track.value || !track.value.playable) return

  audio.value = new Audio(track.value.audio.url)

  audio.value.addEventListener('loadeddata', () => {
    duration.value = audio.value?.duration || 0
    changeVolume(25)

    audio.value?.addEventListener('timeupdate', () => {
      currentTime.value = audio.value?.currentTime || 0
      percentage.value = (currentTime.value / duration.value) * 100
    })

    audio.value?.play()
  })

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      isPaused.value ? playAudio() : pauseAudio()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
    if (audio.value) {
      audio.value.pause()
      audio.value.src = ''
    }
  })
})
</script>

<template>
  <div class="fixed bottom-0 w-full bg-darkGrey py-4 grid grid-cols-4 items-center">
    <div class="flex gap-8 justify-center items-center">
      <div class="flex-1 flex justify-end">
        <img :src="track?.image.url" alt="Track image" class="rounded-regular h-[80px]" />
      </div>
      <router-link :to="'track/' + track?._id" class="text-nowrap text-left text-lg flex-1">
        {{ track?.title }}
      </router-link>
    </div>
    <div class="col-span-2">
      <div class="flex flex-col items-center">
        <button v-if="isPaused" @click="playAudio">
          <PlayIcon />
        </button>
        <button v-else @click="pauseAudio">
          <PauseIcon />
        </button>
        <div class="flex items-center">
          <span class="w-[50px] flex justify-center">{{ currentTimeInMinutes }}</span>
          <div class="w-[500px]">
            <BaseRangeInput :value="percentage" @change="handlePercentageChange" />
          </div>
          <span class="w-[50px] flex justify-center">{{ durationInMinutes }}</span>
        </div>
      </div>
    </div>
    <div>
      <div class="flex justify-center items-center gap-4">
        <button @click="toggleMute">
          <Volume2Icon v-if="volume" />
          <VolumeXIcon v-else />
        </button>
        <BaseRangeInput :value="volume" @change="changeVolume" />
      </div>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import TrackInformation from './audioPlayer/TrackInformation.vue'
import DurationControls from './audioPlayer/DurationControls.vue'
import VolumeControls from './audioPlayer/VolumeControls.vue'
</script>
<template>
  <div class="grid grid-cols-4 fixed bottom-0 w-full h-[100px] bg-darkGrey items-center">
    <TrackInformation />
    <DurationControls class="col-span-2" />
    <VolumeControls />
  </div>
</template>
