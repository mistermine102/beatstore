<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef, watch, type Component } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'
import FiltersList from '../components/filters/FiltersList.vue'
import { BpmFilter, KeyFilter, GenreFilter, PopularityFilter } from '../components/filters/Filters.vine'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import useToggleLike from '../composables/useToggleLike'

//track type
const TRACK_TYPES_BUTTONS = [
  {
    title: 'Beats',
    type: 'beat' as TrackType,
    urlSuffix: 'beats',
  },
  {
    title: 'Samples',
    type: 'sample' as TrackType,
    urlSuffix: 'samples',
  },
  {
    title: 'Drumkits',
    type: 'drumkit' as TrackType,
    urlSuffix: 'drumkits',
  },
]

const trackType = ref<TrackType>('beat')

//filters
const BEAT_FILTERS = [BpmFilter, KeyFilter, GenreFilter, PopularityFilter]
const SAMPLE_FILTERS = [BpmFilter, KeyFilter, PopularityFilter]
const DRUMKIT_FILTERS = [PopularityFilter]

const FILTERS = {
  beat: BEAT_FILTERS,
  sample: SAMPLE_FILTERS,
  drumkit: DRUMKIT_FILTERS,
}

//shallow ref because we have an array of components
const filters = shallowRef<Component[]>(BEAT_FILTERS)

//get tracks
const tracks = ref<Track[]>([])

const wrapGetTracks = reactive(useAsyncWrap())

function getTracks() {
  wrapGetTracks.run(async () => {
    let response

    switch (trackType.value) {
      case 'beat':
        //get beats
        response = await appApi.get<{ beats: Beat[] }>('/beats')
        tracks.value = response.data.beats
        break
      case 'sample':
        //get samples
        response = await appApi.get<{ samples: Sample[] }>('/samples')
        tracks.value = response.data.samples
        break
      case 'drumkit':
        //get drumkits
        response = await appApi.get<{ drumkits: Drumkit[] }>('/drumkits')
        tracks.value = response.data.drumkits
        break
    }
  })
}

const toggleLike = useToggleLike()

function toggleTrackLike(track: Track) {
  const foundTrack = tracks.value.find(el => el._id === track._id)
  if (!foundTrack) return

  toggleLike(foundTrack)
}

//get new tracks and update track filters when track type changes
watch(trackType, () => {
  filters.value = FILTERS[trackType.value]
  getTracks()
})

onMounted(() => {
  getTracks()
})
</script>
<template>
  <div class="h-full">
    <FrontpageHero />
    <BaseSearchbar />
    <div class="flex gap-8 mt-16">
      <div class="w-1/5">
        <FiltersList :filters="filters" />
      </div>
      <div class="w-4/5">
        <div class="grid grid-cols-3 gap-4 mb-8">
          <button v-for="btn in TRACK_TYPES_BUTTONS" @click="trackType = btn.type" :class="[trackType === btn.type ? 'base-btn' : 'base-btn-alt']">
            {{ btn.title }}
          </button>
        </div>
        <TracksContainer :tracks="tracks" :isLoading="wrapGetTracks.isLoading" @likeToggled="toggleTrackLike" />
      </div>
    </div>
  </div>
</template>
