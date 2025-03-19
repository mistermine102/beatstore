<script setup lang="ts">
import TrackOptionsPopover from './TrackOptionsPopover.vue'
import InteractiveWaveform from '../InteractiveWaveform.vue'
import { useAuthStore } from '../../stores/auth'
import getWaveformColors from '../../utils/getWaveformColors'
import useInteractiveWafeform from '../../composables/useInteractiveWafeform'
import { useCssVar } from '@vueuse/core'
import { HeartIcon, PlayIcon } from '../icons/index.vine'
import PlayPauseBtn from '../PlayPauseBtn.vue'
import useToggleLike from '../../composables/useToggleLike'
import { computed, ref } from 'vue'
import LoginPromptModal from '../../components/LoginPromptModal.vue'

const props = defineProps<{ track: Track }>()
const emit = defineEmits(['likeToggled'])

const { track } = props
const authStore = useAuthStore()
const { toggleLike, showLoginPrompt } = useToggleLike()

const isAnimating = ref(false)

function handleLike() {
  toggleLike(props.track)
  isAnimating.value = true
  emit('likeToggled')

  // Reset animation state after animation completes
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

const { handleWaveformClick, waveformProgress } = useInteractiveWafeform(track)

const defaultColors = {
  waveformColor: useCssVar('--darkGrey').value,
  progressColor: useCssVar('--primary').value,
  highlightColor: useCssVar('--darkPrimary').value,
}

const colors = track.image.averageColor ? getWaveformColors(track.image.averageColor.hex) : defaultColors

const { waveformColor, progressColor, highlightColor } = colors

const waveformWidth = computed(() => {
  switch (true) {
    case window.innerWidth > 1800:
      return 500
    case window.innerWidth > 1650:
      return 400
    case window.innerWidth > 1536:
      return 320
    case window.innerWidth > 1280:
      return 350
    case window.innerWidth > 1024:
      return 500
    case window.innerWidth > 768:
      return 400
    default:
      return 400
  }
})

const waveformHeight = computed(() => {
  switch (true) {
    case waveformWidth.value > 380:
      return 80
    default:
      return 60
  }
})
</script>

<template>
  <div class="panel relative">
    <div class="mb-16">
      <div v-if="track.author._id === authStore.user?._id" class="absolute top-4 right-4 z-20">
        <TrackOptionsPopover :track="track" />
      </div>
      <div class="flex gap-x-8">
        <div>
          <div class="relative group w-[200px] h-[200px] rounded-xl overflow-hidden">
            <div
              v-if="track.playable"
              class="absolute inset-0 z-10 flex justify-center items-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-150"
            >
              <PlayPauseBtn :track="track" class="scale-125 transform transition-transform duration-150" button-class="hover:text-white" />
            </div>
            <img
              :src="track.image.url"
              alt="Track"
              class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-150"
            />
          </div>
          <div class="flex justify-center gap-x-8 mt-4">
            <button @click="handleLike" class="flex gap-x-2 items-center group cursor-pointer">
              <HeartIcon
                :fill="track.isLiked"
                class="w-8 transition-all duration-150 shrink-0"
                :class="[isAnimating && 'animate-like', track.isLiked ? 'text-primary' : 'text-iconLightGrey group-hover:text-primary']"
              />
              <p
                class="text-lg transition-colors duration-150"
                :class="[track.isLiked ? 'text-primary' : 'text-textLightGrey group-hover:text-primary']"
              >
                {{ track.totalLikes }}
              </p>
            </button>
            <div class="flex gap-x-2 items-center">
              <PlayIcon class="w-10 text-iconLightGrey shrink-0" />
              <p class="text-lg text-textLightGrey">{{ track.totalStreams }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col min-w-0 max-w-full flex-1">
          <router-link :to="`/profile/${track.author._id}`" class="text-lg text-textLightGrey truncate block">
            {{ track.author.username }}
          </router-link>
          <div class="flex justify-between items-center">
            <h2 class="font-secondary text-[48px] text-white -mt-2 mb-4 truncate">{{ track.title }}</h2>
            <p
              class="inline-block px-3 py-1 rounded-regular text-sm font-semibold shadow-md h-fit mb-4"
              :class="{
                'bg-indigo-700': track.type === 'beat',
                'bg-fuchsia-700': track.type === 'sample',
                'bg-yellow-700': track.type === 'drumkit',
                'bg-emerald-700': track.type === 'loop',
              }"
            >
              {{ track.type === 'beat' ? 'Beat' : track.type === 'sample' ? 'Sample' : track.type === 'drumkit' ? 'Drumkit' : 'Loop' }}
            </p>
          </div>
          <div v-if="track.playable" class="flex gap-x-8 items-center justify-start sm:justify-center">
            <div class="w-fit group" :style="{ color: progressColor }">
              <PlayPauseBtn
                :track="track"
                :icon-size="32"
                class="[&>.play-pause-text]:hidden relative"
                button-class="hover:scale-105 transition-transform duration-150"
              />
            </div>
            <div class="space-y-4 w-full h-full hidden sm:block">
              <InteractiveWaveform
                :width="waveformWidth"
                :height="waveformHeight"
                :waveform-color="waveformColor"
                :progress-color="progressColor"
                :highlight-color="highlightColor"
                :waveform-data="track.audio.waveform.samples"
                :progress="waveformProgress"
                @progress-click="handleWaveformClick"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-16">
      <h2 class="base-heading mb-2">{{ track.license.shortDescription }}</h2>
      <p class="text-textLightGrey">{{ track.license.longDescription }}</p>
    </div>
    <div class="mb-8">
      <h2 class="base-heading mb-4">Description</h2>
      <p v-if="track.description" class="overflow-hidden text-textLightGrey">{{ track.description }}</p>
      <p v-else class="text-textLightGrey">No description</p>
    </div>
  </div>

  <LoginPromptModal :is-open="showLoginPrompt" message="Log in to leave a like" @close="showLoginPrompt = false" />
</template>
