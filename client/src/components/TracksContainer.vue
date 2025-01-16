<script setup lang="ts">
import BaseButton from './base/BaseButton.vue'
import EmptyState from './EmptyState.vue'
import Track from './Track.vue'

interface Props {
  tracks: Track[]
  isMore: boolean
  isLoadingMore: boolean
  isLoading?: boolean
}

interface Emits {
  (e: 'likeToggled', track: Track): void
  (e: 'loadedMore'): void
}

const { isLoading = false } = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="min-h-[400px]">
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <div class="loader"></div>
    </div>
    <div v-else>
      <div v-if="!tracks.length" class="flex justify-left">
        <EmptyState />
      </div>
      <div v-else class="grid gap-8">
        <Track v-for="track in tracks" :track="track" :key="track._id" @like-toggled="emit('likeToggled', track)"></Track>
        <div class="w-1/2 mx-auto">
          <BaseButton v-if="isMore" :is-loading="isLoadingMore" alt @click="emit('loadedMore')" class="w-fit">Load more</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
