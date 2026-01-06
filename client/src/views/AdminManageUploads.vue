<script setup lang="ts">
import { ref } from 'vue'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import BaseButton from '../components/base/BaseButton.vue'
import EmptyState from '../components/EmptyState.vue'
import PlayPauseBtn from '../components/PlayPauseBtn.vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const tracks = ref<Track[]>([])
const wrapGetTracks = useAsyncWrap()
const wrapApproveTrack = useAsyncWrap()
const trackApproved = ref({
  id: '',
  approved: false,
})

function getTracks() {
  wrapGetTracks.run(async () => {
    const response = await appApi.get<{ tracks: Track[] }>('/admin/tracks/unverified')
    tracks.value = response.data.tracks
  })
}

async function approveTrack(trackId: string, approve: boolean) {
  wrapApproveTrack.run(async () => {
    trackApproved.value.id = trackId
    trackApproved.value.approved = approve
    await appApi.post(`/admin/tracks/verify/${trackId}`, {
      approve,
    })
    getTracks()
  })
}

getTracks()
</script>

<template>
  <ScreenWrapper>
    <h1 class="base-heading">Uploads to Verify</h1>
    <div v-if="wrapGetTracks.isLoading.value" class="flex justify-center">
      <div class="loader"></div>
    </div>
    <div v-else-if="!tracks.length" class="w-full">
      <EmptyState />
    </div>
    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="track in tracks" :key="track._id" class="base-container p-8">
        <div class="flex gap-8">
          <div class="min-w-[200px]">
            <img :src="track.image.url" class="image-medium mb-4" />
            <h3 class="text-xl mb-1">{{ track.title }}</h3>
            <p class="text-gray-400">By {{ track.author }}</p>
          </div>
          
          <div class="flex-1 bg-darkGrey p-4 rounded-sm">
            <div class="flex items-center gap-4 mb-4">
              <PlayPauseBtn v-if="track.playable" :track="track" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <p><span class="text-gray-400">Type:</span> {{ track.type }}</p>
              <p><span class="text-gray-400">Genre:</span> {{ track.genre }}</p>
              <p><span class="text-gray-400">Key:</span> {{ track.key }}</p>
              <p><span class="text-gray-400">BPM:</span> {{ track.bpm }}</p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-4 min-w-[140px]">
            <div class="flex flex-col gap-2">
              <BaseButton
                class="w-32"
                @click="approveTrack(track._id, true)"
                :is-loading="wrapApproveTrack.isLoading.value && track._id === trackApproved.id && trackApproved.approved"
              >
                Approve
              </BaseButton>
              <BaseButton
                class="w-32"
                alt
                @click="approveTrack(track._id, false)"
                :is-loading="wrapApproveTrack.isLoading.value && track._id === trackApproved.id && !trackApproved.approved"
              >
                Remove
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ScreenWrapper>
</template>