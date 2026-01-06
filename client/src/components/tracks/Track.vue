<script setup lang="ts">
import PlayPauseBtn from '../common/PlayPauseBtn.vue'
import InteractiveWaveform from '../common/InteractiveWaveform.vue'
import useInteractiveWafeform from '../../composables/useInteractiveWafeform'
import { useCssVar } from '@vueuse/core'
import LikeButton from '../common/LikeButton.vue'
import { computed } from 'vue'

const { track } = defineProps<{ track: Track }>()
const emit = defineEmits(['likeToggled'])

const { handleWaveformClick, waveformProgress } = useInteractiveWafeform(track)

const waveformWidth = computed(() => {
  switch (true) {
    case window.innerWidth > 1024:
      return 500
    case window.innerWidth > 768:
      return 400
    default:
      return 300
  }
})
</script>

<template>
  <div class="grid md:grid-cols-6 gap-x-4 group">
    <div class="flex gap-x-4 col-span-2">
      <div class="image-thumbnail relative rounded-regular">
        <div
          v-if="track.playable"
          class="absolute inset-0 z-10 flex justify-center items-center group-hover:bg-black/60 transition-all duration-150 rounded-regular"
        >
          <PlayPauseBtn :track="track" class="opacity-0 group-hover:opacity-100" button-class="hover:text-white" />
        </div>
        <img :src="track.image.url" alt="Track image" class="absolute inset-0 rounded-regular" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex gap-x-4">
          <div class="w-full min-w-0">
            <router-link :to="`/profile/${track.author._id}`">
              <p class="text-textLightGrey truncate">{{ track.author.username }}</p>
            </router-link>
            <router-link v-if="track.verified" :to="`/track/${track._id}`">
              <h2 class="text-xl -mt-1 truncate">{{ track.title }}</h2>
            </router-link>
            <h2 v-else class="text-xl -mt-1 truncate">{{ track.title }}</h2>
          </div>
        </div>
        <div v-if="track.verified" class="flex gap-x-1 items-center mt-1">
          <LikeButton :likes="track.totalLikes" :is-liked="track.isLiked" @click="emit('likeToggled')" />
        </div>
      </div>
    </div>
    <div class="flex flex-col col-span-3">
      <div class="mb-4 hidden md:block">
        <InteractiveWaveform
          v-if="track.playable"
          :height="60"
          :width="waveformWidth"
          :progress-color="useCssVar('--primary').value"
          :highlight-color="useCssVar('--darkPrimary').value"
          :waveform-data="track.audio.waveform.samples"
          :progress="waveformProgress"
          @progress-click="handleWaveformClick"
        />
      </div>
      <div>
        <div class="text-textLightGrey flex gap-x-2 flex-wrap max-w-[500px]">
          <p v-if="track.bpm !== undefined" class="flex gap-x-1">
            Bpm: <span class="text-white">{{ track.bpm || 'Unknown' }}</span>
          </p>
          <p v-if="track.key !== undefined" class="flex gap-x-1">
            Key: <span class="text-white">{{ track.key || 'Unknown' }}</span>
          </p>
          <p v-if="track.genre !== undefined" class="flex gap-x-1">
            Genre: <span class="text-white">{{ track.genre || 'Unknown' }}</span>
          </p>
          <p v-if="track.instruments !== undefined" class="flex gap-x-1">
            Instruments:
            <span class="text-white" v-tippy="track.instruments.join(', ')">
              {{
                track.instruments.length
                  ? track.instruments.slice(0, 3).join(', ') + (track.instruments.length > 3 ? ` +${track.instruments.length - 3}` : '')
                  : 'Unknown'
              }}
            </span>
          </p>
          <p v-if="track.mood !== undefined" class="flex gap-x-1">
            Mood: <span class="text-white">{{ track.mood || 'Unknown' }}</span>
          </p>
        </div>
      </div>
    </div>
    <div>
      <p v-if="!track.verified" class="text-orange-500">Unverified</p>
      <p
        class="inline-block px-3 py-1 rounded-regular text-sm font-semibold shadow-md"
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
  </div>
</template>
