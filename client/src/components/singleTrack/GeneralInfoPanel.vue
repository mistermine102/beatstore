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
import { ref } from 'vue'
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
</script>

<template>
  <div class="panel relative mb-8">
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
            <button 
              @click="handleLike"
              class="flex gap-x-2 items-center group cursor-pointer"
            >
              <HeartIcon 
                :fill="track.isLiked"
                class="w-8 transition-all duration-150 shrink-0"
                :class="[
                  isAnimating && 'animate-like',
                  track.isLiked ? 'text-primary' : 'text-iconLightGrey group-hover:text-primary'
                ]"
              />
              <p class="text-lg transition-colors duration-150" :class="[
                track.isLiked ? 'text-primary' : 'text-textLightGrey group-hover:text-primary'
              ]">
                {{ track.totalLikes }}
              </p>
            </button>
            <div class="flex gap-x-2 items-center">
              <PlayIcon class="w-10 text-iconLightGrey shrink-0" />
              <p class="text-lg text-textLightGrey">{{ track.totalStreams }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col">
          <p class="text-lg text-textLightGrey">{{ track.author.username }}</p>
          <h2 class="font-secondary text-[48px] text-white -mt-4 mb-4">{{ track.title }}</h2>
          <div v-if="track.playable" class="flex gap-x-8 items-center justify-center">
            <div class="w-fit group" :style="{ color: progressColor }">
              <PlayPauseBtn 
                :track="track" 
                :icon-size="32"
                class="[&>.play-pause-text]:hidden relative"
                button-class="hover:scale-105 transition-transform duration-150"
              />
            </div>
            <div class="space-y-2 w-full h-full">
              <p class="text-xs font-medium opacity-75">{{ track.audio.duration.formatted }}</p>
              <InteractiveWaveform
                :width="400"
                :height="80"
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
    <div class="mb-8">
      <h2 class="base-heading mb-4">Description</h2>
      <p v-if="track.description" class="overflow-hidden text-textLightGrey">{{ track.description }}</p>
      <p v-else class="text-textLightGrey">No description</p>
    </div>
  </div>

  <LoginPromptModal 
    :is-open="showLoginPrompt"
    message="Log in to like the track"
    @close="showLoginPrompt = false"
  />
</template>
