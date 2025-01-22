<script setup lang="ts">
import PlayPauseBtn from './PlayPauseBtn.vue'
import { HeartIcon } from './icons/index.vine'
import moment from 'moment'
defineProps<{ track: Track }>()

const emit = defineEmits(['likeToggled'])
</script>
<template>
  <div class="grid grid-cols-4 gap-x-4">
    <div class="flex gap-x-4 col-span-2">
      <img class="image-thumbnail" :src="track.image.url" alt="Track image" />
      <div>
        <div class="flex gap-x-4">
          <div>
            <router-link :to="`/profile/${track.author._id}`">
              <p class="text-textLightGrey">{{ track.author.username }}</p>
            </router-link>
            <router-link :to="`/track/${track._id}`">
              <h2 class="whitespace-nowrap text-xl -mt-1">{{ track.title }}</h2>
            </router-link>
          </div>
          <PlayPauseBtn v-if="track.playable" :track="track" />
        </div>

        <button class="mt-1" @click="emit('likeToggled')">
          <HeartIcon :class="[track.isLiked ? 'text-primary' : 'text-textLightGrey']" />
        </button>
        <!-- <p class="text-textLightGrey" v-if="track.playable">{{ track.audio.duration.formatted }}</p> -->
      </div>
    </div>
    <div class="text-textLightGrey flex flex-col gap-y-2">
      <p v-if="track.bpm !== undefined">Bpm: {{ track.bpm || 'Unknown' }}</p>
      <p v-if="track.key !== undefined">Key: {{ track.key || 'Unknown' }}</p>
      <p v-if="track.genre !== undefined">Genre: {{ track.genre || 'Unknown' }}</p>
    </div>
    <div>
      <p class="text-textLightGrey mb-2">{{ moment(track.createdAt).format('LL') }}</p>
    </div>
  </div>
</template>
