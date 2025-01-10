<script setup lang="ts">
import { useRoute } from 'vue-router'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { reactive, ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import useToggleTrackLike from '../composables/useToggleLike'

import GeneralInfoPanel from '../components/singleTrack/GeneralInfoPanel.vue'
import DetailsPanel from '../components/singleTrack/DetailsPanel.vue'
import AuthorPanel from '../components/singleTrack/AuthorPanel.vue'

const route = useRoute()
const wrapGetTrack = reactive(useAsyncWrap())

const { type: trackType, id: trackId } = route.params as {
  type: TrackType
  id: string
}

const track = ref<Track | null>(null)

function getTrack() {
  wrapGetTrack.run(async () => {
    let trackUrl: string

    switch (trackType) {
      case 'beat':
        trackUrl = '/beats'
        break
      case 'sample':
        trackUrl = '/samples'
        break
      case 'drumkit':
        trackUrl = '/drumkits'
        break
    }

    const response = await appApi.get<{ track: Track }>(`${trackUrl}/${trackId}`)
    track.value = response.data.track
  })
}

getTrack()

const toggleTrackLike = useToggleTrackLike()
</script>

<template>
  <div v-if="wrapGetTrack.isLoading" class="loader mx-auto mt-64"></div>
  <div v-else>
    <div v-if="!track">
      <EmptyState />
    </div>
    <div v-else>
      <GeneralInfoPanel :track="track" />
      <div class="grid grid-cols-3 gap-x-8">
        <DetailsPanel class="col-span-2" :track="track" @track-like-toggled="toggleTrackLike(track)" />
        <AuthorPanel :profile-id="track.author._id" />
      </div>
    </div>
  </div>
</template>
