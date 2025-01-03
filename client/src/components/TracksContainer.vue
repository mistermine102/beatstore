<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EmptyState from './EmptyState.vue'
import Track from './Track.vue'

interface Props {
  tracks: Track[]
  isLoading: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="h-full">
    <div v-if="isLoading" class="flex justify-center h-full">
      <div class="loader"></div>
    </div>
    <div v-else>
      <div v-if="!tracks.length" class="flex justify-left">
        <EmptyState />
      </div>
      <div v-else class="grid gap-8">
        <Track v-for="track in tracks" :track="track" :key="track._id"></Track>
      </div>
    </div>
  </div>
</template>
