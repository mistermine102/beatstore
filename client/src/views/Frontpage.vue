<script setup lang="ts">
import { onMounted, ref, watch, type Component } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'
import FiltersList from '../components/filters/FiltersList.vue'
import { BpmFilter, KeyFilter, GenreFilter, PopularityFilter } from '../components/filters/Filters.vine'
import appApi from '../api/appApi'
import useAsyncWrap from '../hooks/useAsyncWrap'

const wrapGetTracks = useAsyncWrap()

const filters: Component[] = [BpmFilter, KeyFilter, GenreFilter, PopularityFilter]

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
const tracks = ref<Track[]>([])

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

watch(trackType, () => {
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
        <div class="grid grid-cols-3 gap-4 mb-4">
          <button v-for="btn in TRACK_TYPES_BUTTONS" @click="trackType = btn.type" :class="[trackType === btn.type ? 'base-btn' : 'base-btn-alt']">
            {{ btn.title }}
          </button>
        </div>
        <TracksContainer :tracks="tracks" :isLoading="wrapGetTracks.isLoading.value" />
      </div>
    </div>
  </div>
</template>
