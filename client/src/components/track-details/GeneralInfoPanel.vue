<script setup lang="ts">
import TrackOptionsPopover from './TrackOptionsPopover.vue'
import InteractiveWaveform from '../common/InteractiveWaveform.vue'
import { useAuthStore } from '../../stores/auth'
import getWaveformColors from '../../utils/getWaveformColors'
import useInteractiveWafeform from '../../composables/useInteractiveWafeform'
import { useCssVar } from '@vueuse/core'
import { DownloadIcon, HeartIcon, PlayIcon } from '../icons/index.vine'
import PlayPauseBtn from '../common/PlayPauseBtn.vue'
import useToggleLike from '../../composables/useToggleLike'
import { computed, ref } from 'vue'
import BuyTrackModal from './BuyTrackModal.vue'
import BaseButton from '../base/BaseButton.vue'
import useAsyncWrap from '../../composables/useAsyncWrap'
import axios from 'axios'
import LoginPromptModal from '../auth/LoginPromptModal.vue'
import BaseBadge from '../base/BaseBadge.vue'

const props = defineProps<{ track: Track }>()
const emit = defineEmits(['likeToggled'])

const { track } = props
const authStore = useAuthStore()
const { toggleLike, showLoginPrompt } = useToggleLike()

const isAnimating = ref(false)
const isBuyModalOpen = ref(false)

function handleLike() {
  toggleLike(props.track)
  isAnimating.value = true
  emit('likeToggled')

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

// Adjusted width calculation logic
const waveformWidth = computed(() => {
  if (typeof window === 'undefined') return 400
  if (window.innerWidth > 1800) return 500
  if (window.innerWidth > 1650) return 400
  if (window.innerWidth > 1536) return 320
  if (window.innerWidth > 1280) return 350
  if (window.innerWidth > 1024) return 500
  return 400
})

const waveformHeight = computed(() => {
  return waveformWidth.value > 380 ? 80 : 60
})

const wrapDownloadAudio = useAsyncWrap()

function downloadAudio(track: Track) {
  wrapDownloadAudio.run(async () => {
    if (!track.audio?.url) return
    const filename = track.title
    const response = await axios.get(track.audio.url, { responseType: 'blob' })
    const sanitizedFilename = filename.replace(/[^a-z0-9.]/gi, '_').replace(/_+/g, '_')
    const prefixedFilename = `wm-${track.type}-${sanitizedFilename}`
    const finalFilename = prefixedFilename.includes('.') ? prefixedFilename : `${prefixedFilename}.wav`
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }))
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = finalFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  })
}
</script>

<template>
  <div class="panel relative">
    <!-- Options Popover (Absolute) -->
    <div v-if="track.author._id === authStore.user?._id" class="absolute top-0 right-0 z-20">
      <TrackOptionsPopover :track="track" />
    </div>

    <!-- Main Content Layout -->
    <div class="flex flex-col md:flex-row gap-8 mb-8">
      <!-- LEFT COLUMN: Image & Stats -->
      <div class="flex flex-col items-center md:items-start shrink-0">
        <!-- Image Container -->
        <div class="relative group w-full max-w-[280px] aspect-square md:w-[200px] md:h-[200px] rounded-xl overflow-hidden shadow-lg">
          <!-- Play Overlay (Desktop Hover / Mobile Visible) -->
          <div
            v-if="track.playable"
            class="absolute inset-0 z-10 flex justify-center items-center bg-black/30 md:opacity-0 md:group-hover:opacity-100 transition-all duration-150"
          >
            <!-- Only show this play button on hover for desktop, or if needed on mobile visual -->
            <PlayPauseBtn :track="track" class="scale-125 transform transition-transform duration-150" button-class="hover:text-white" />
          </div>
          <img
            :src="track.image.url"
            alt="Track"
            class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-150"
          />
        </div>

        <!-- Stats Row -->
        <div class="flex justify-center md:justify-start gap-x-8 mt-4 md:mt-4 w-full">
          <!-- Like Button -->
          <button @click="handleLike" class="flex gap-x-2 items-center group cursor-pointer p-2 md:p-0">
            <HeartIcon
              :fill="track.isLiked"
              class="w-6 h-6 md:w-8 md:h-8 transition-all duration-150 shrink-0"
              :class="[isAnimating && 'animate-like', track.isLiked ? 'text-primary' : 'text-iconLightGrey group-hover:text-primary']"
            />
            <p
              class="text-base md:text-lg transition-colors duration-150 font-medium"
              :class="[track.isLiked ? 'text-primary' : 'text-textLightGrey group-hover:text-primary']"
            >
              {{ track.totalLikes }}
            </p>
          </button>

          <!-- Stream Count -->
          <div class="flex gap-x-2 items-center p-2 md:p-0">
            <PlayIcon class="w-8 h-8 md:w-10 md:h-10 text-iconLightGrey shrink-0" />
            <p class="text-base md:text-lg text-textLightGrey font-medium">{{ track.totalStreams }}</p>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Details & Actions -->
      <div class="flex flex-col min-w-0 max-w-full flex-1 text-center md:text-left">
        <!-- Author Name -->
        <router-link
          :to="`/profile/${track.author._id}`"
          class="text-base md:text-lg text-textLightGrey hover:text-white transition-colors truncate block mb-1 md:mb-0"
        >
          {{ track.author.username }}
        </router-link>

        <!-- Title & Badge -->
        <div class="flex flex-col md:flex-row md:justify-between items-center md:items-start mb-6 md:mb-4 gap-2">
          <h2 class="font-secondary text-3xl md:text-5xl text-white leading-tight break-words max-w-full">
            {{ track.title }}
          </h2>

          <BaseBadge class="mt-1 md:mt-2">
            {{ track.type === 'beat' ? 'Beat' : track.type === 'sample' ? 'Sample' : track.type === 'drumkit' ? 'Drumkit' : 'Loop' }}
          </BaseBadge>
        </div>

        <!-- Waveform Section (Hidden on Mobile) -->
        <div v-if="track.playable" class="hidden md:flex gap-x-8 items-center justify-start sm:justify-center mb-6">
          <div class="w-fit group" :style="{ color: progressColor }">
            <PlayPauseBtn
              :track="track"
              :icon-size="32"
              class="[&>.play-pause-text]:hidden relative"
              button-class="hover:scale-105 transition-transform duration-150"
            />
          </div>
          <div class="space-y-4 w-full h-full">
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

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:flex gap-4 md:gap-x-4 w-full md:w-auto mt-auto">
          <!-- Case 1: Paid + Platform - Show Buy Button -->
          <BaseButton
            v-if="track.pricingType === 'paid' && track.sellThrough === 'platform'"
            @click="isBuyModalOpen = true"
            class="w-full md:w-auto px-8 py-3 md:py-2"
          >
            Buy now
          </BaseButton>

          <!-- Case 2: Free - Show Free Use Message -->
          <div
            v-else-if="track.pricingType === 'free'"
            class="bg-grey border border-white/[0.1] rounded-regular px-4 py-3 text-textLightGrey text-sm"
          >
            <span class="text-primary font-medium">Free to use!</span> This track was generously uploaded for commercial use at no cost.
          </div>

          <!-- Case 3: Paid + External - Show Contact Seller Message -->
          <div
            v-else-if="track.pricingType === 'paid' && track.sellThrough === 'external'"
            class="bg-grey border border-white/[0.1] rounded-regular px-4 py-3 text-textLightGrey text-sm"
          >
            To purchase this track, please contact the seller directly.
          </div>

          <BaseButton v-if="track.audio && track.freeDownloadPolicy === 'direct'" @click="downloadAudio(track)" :alt="true" class="w-full md:w-auto">
            <Box class="flex justify-center md:justify-start gap-x-2 items-center px-6">
              <DownloadIcon class="w-5 h-5" />
              <span>Download</span>
            </Box>
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Description Section -->
    <div class="mb-8 pt-4 md:pt-0 border-t border-white/10 md:border-none">
      <h2 class="base-heading mb-3 text-xl md:text-2xl">Description</h2>
      <p v-if="track.description" class="overflow-hidden text-textLightGrey leading-relaxed text-sm md:text-base">
        {{ track.description }}
      </p>
      <p v-else class="text-textLightGrey italic">No description provided.</p>
    </div>
  </div>

  <LoginPromptModal :is-open="showLoginPrompt" message="Log in to leave a like" @close="showLoginPrompt = false" />
  <BuyTrackModal
    v-if="track.pricingType === 'paid' && track.sellThrough === 'platform'"
    :is-open="isBuyModalOpen"
    :tiers="track.tiers"
    :track-title="track.title"
    :track-id="track._id"
    @close="isBuyModalOpen = false"
  />
</template>

<style scoped>
/* Optional: Ensure text doesn't overflow inappropriately on very small screens */
.break-words {
  word-break: break-word;
}
</style>
