<script setup lang="ts">
import { HeartIcon } from '../icons/index.vine'

defineProps<{ track: Track }>()
const emit = defineEmits(['trackLikeToggled'])
</script>

<template>
  <div class="base-container">
    <h2 class="text-2xl mb-4">Details</h2>
    <div class="grid grid-cols-2 gap-x-16">
      <div class="flex flex-col divide-y items-center">
        <p v-if="track.bpm !== undefined" class="flex justify-between w-full py-4 px-8">
          <span class="text-textLightGrey">Bpm</span> <span>{{ track.bpm || 'Unknown' }}</span>
        </p>
        <p v-if="track.key !== undefined" class="flex justify-between w-full py-4 px-8">
          <span class="text-textLightGrey">Key</span> <span>{{ track.key || 'Unknown' }}</span>
        </p>
        <p v-if="track.genre !== undefined" class="flex justify-between w-full py-4 px-8">
          <span class="text-textLightGrey">Genre</span> <span>{{ track.genre || 'Unknown' }}</span>
        </p>
      </div>
      <div class="flex flex-col gap-8">
        <div class="flex gap-4">
          <div v-if="track.totalStreams !== undefined" class="flex gap-2">
            <span>Plays {{ track.totalStreams }}</span>
          </div>
          <div class="flex gap-2">
            <span>Likes {{ track.totalLikes }}</span>
            <button @click="emit('trackLikeToggled')">
              <HeartIcon :class="[track.isLiked ? 'text-primary' : '']" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
