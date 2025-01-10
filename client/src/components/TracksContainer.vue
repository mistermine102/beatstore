<script setup lang="ts">
import EmptyState from './EmptyState.vue'
import Track from './Track.vue'

interface Props {
  tracks: Track[]
  isLoading?: boolean
}

const { isLoading = false } = defineProps<Props>()
const emit = defineEmits(['likeToggled'])
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center h-full">
      <div class="loader"></div>
    </div>
    <div v-else>
      <div v-if="!tracks.length" class="flex justify-left">
        <EmptyState />
      </div>
      <div v-else class="grid gap-8">
        <Track v-for="track in tracks" :track="track" :key="track._id" @like-toggled="emit('likeToggled', track)"></Track>
      </div>
    </div>
  </div>
</template>
