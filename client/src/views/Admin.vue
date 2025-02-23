<script setup lang="ts">
import { ref } from 'vue'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import BaseButton from '../components/base/BaseButton.vue'
import EmptyState from '../components/EmptyState.vue'
import PlayPauseBtn from '../components/PlayPauseBtn.vue'

const tracks = ref<Track[]>([])

const wrapGetTracks = useAsyncWrap()

function getTracks() {
  wrapGetTracks.run(async () => {
    const response = await appApi.get<{ tracks: Track[] }>('/admin/tracks/unverified')
    tracks.value = response.data.tracks
  })
}

const wrapApproveTrack = useAsyncWrap()
const trackApproved = ref({
  id: '',
  approved: false,
})

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
  <h1 class="base-heading">Uploads to verify</h1>
  <div v-if="wrapGetTracks.isLoading.value" class="flex justify-center">
    <div class="loader"></div>
  </div>
  <div v-else-if="!tracks.length" class="w-full">
    <EmptyState />
  </div>
  <div v-else class="grid grid-cols-3 gap-y-8 gap-x-16">
    <div v-for="track in tracks" class="flex flex-col gap-y-4">
      <div class="flex gap-x-4">
        <img :src="track.image.url" class="image-medium" />
        <div>
          <PlayPauseBtn v-if="track.playable" :track="track" />
          <p>TYPE: {{ track.type }}</p>
          <p>TITLE: {{ track.title }}</p>
          <p>KEY: {{ track.key }}</p>
          <p>BPM: {{ track.bpm }}</p>
          <p>GENRE: {{ track.genre }}</p>
        </div>
      </div>
      <div class="flex gap-x-2">
        <BaseButton
          class="w-full"
          @click="approveTrack(track._id, true)"
          :is-loading="wrapApproveTrack.isLoading.value && track._id === trackApproved.id && trackApproved.approved"
          >Approve</BaseButton
        >
        <BaseButton
          class="w-full"
          alt
          @click="approveTrack(track._id, false)"
          :is-loading="wrapApproveTrack.isLoading.value && track._id === trackApproved.id && !trackApproved.approved"
          >Remove</BaseButton
        >
      </div>
    </div>
  </div>
</template>
