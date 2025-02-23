<script setup lang="ts">
import PlayPauseBtn from './PlayPauseBtn.vue'
import { HeartIcon } from './icons/index.vine'
import InteractiveWaveform from './InteractiveWaveform.vue'
import useInteractiveWafeform from '../composables/useInteractiveWafeform'
import { useCssVar } from '@vueuse/core'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'

const props = defineProps<{ track: Track }>()
const emit = defineEmits(['likeToggled'])

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const { handleWaveformClick, waveformProgress } = useInteractiveWafeform(props.track)


</script>
<template>
  <div class="grid grid-cols-6 gap-x-4">
    <div class="flex gap-x-4 col-span-2">
      <img class="image-thumbnail" :src="track.image.url" alt="Track image" />
      <div>
        <div class="flex gap-x-4">
          <div>
            <router-link :to="`/profile/${track.author._id}`">
              <p class="text-textLightGrey">{{ track.author.username }}</p>
            </router-link>
            <router-link v-if="track.verified" :to="`/track/${track._id}`">
              <h2 class="text-xl -mt-1">{{ track.title }}</h2>
            </router-link>
            <h2 v-else class="text-xl -mt-1">{{ track.title }}</h2>
          </div>
        </div>
        <div v-if="track.verified" class="flex gap-x-1">
          <button class="mt-1" @click="emit('likeToggled')">
            <HeartIcon :class="[track.isLiked ? 'text-primary' : 'text-textLightGrey']" />
          </button>
        </div>
      </div>
    </div>
    <div class="col-span-3 flex flex-col">
      <div>
        <InteractiveWaveform
          v-if="track.playable"
          :height="80"
          :width="500"
          :progress-color="useCssVar('--primary').value"
          :highlight-color="useCssVar('--darkPrimary').value"
          :waveform-data="track.audio.waveform.samples"
          :progress="waveformProgress"
          @progress-click="handleWaveformClick"
        />
      </div>
      <div class="grid grid-cols-8">
        <PlayPauseBtn v-if="track.playable" :track="track" />
        <div class="text-textLightGrey flex gap-x-2 col-span-6">
          <p v-if="track.bpm !== undefined">
            Bpm: <span class="text-white">{{ track.bpm || 'Unknown' }}</span>
          </p>
          <p v-if="track.key !== undefined">
            Key: <span class="text-white">{{ track.key || 'Unknown' }}</span>
          </p>
          <p v-if="track.genre !== undefined">
            Genre: <span class="text-white">{{ track.genre || 'Unknown' }}</span>
          </p>
        </div>
      </div>
    </div>
    <div>
      <p v-if="!track.verified" class="text-orange-500">Unverified</p>
    </div>
  </div>
</template>
