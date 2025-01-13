<script setup lang="ts">
import { onMounted, ref, shallowRef, watch, type Component } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'
import ActiveFiltersList from '../components/ActiveFiltersList.vue'
import FiltersList from '../components/filters/FiltersList.vue'
import { BpmFilter, KeyFilter, GenreFilter, PopularityFilter } from '../components/filters/Filters.vine'
import useTracks from '../composables/useTracks'

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


//filters
const BEAT_FILTERS = [BpmFilter, KeyFilter, GenreFilter, PopularityFilter]
const SAMPLE_FILTERS = [BpmFilter, KeyFilter, PopularityFilter]
const DRUMKIT_FILTERS = [PopularityFilter]

const FILTERS = {
  beat: BEAT_FILTERS,
  sample: SAMPLE_FILTERS,
  drumkit: DRUMKIT_FILTERS,
}

const { tracks, getTracks, isLoading, toggleLike, isMore, loadMoreTracks, isLoadingMore } = useTracks()

//shallow ref because we have an array of components
const filters = shallowRef<Component[]>(BEAT_FILTERS)
const trackType = ref<TrackType>('beat')

//get new tracks and update track filters when track type changes
watch(trackType, () => {
  filters.value = FILTERS[trackType.value]
  getTracks(trackType.value, {
    filters: {
      key: 'A Minor',
    },
  })
})

onMounted(() => {
  getTracks(trackType.value, {
    filters: {
      key: 'A Minor',
    },
  })
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
        <!-- <ActiveFiltersList class="mb-4" /> -->
        <TracksContainer
          :tracks="tracks"
          :isLoading="isLoading"
          :isLoadingMore="isLoadingMore"
          :isMore="isMore"
          @likeToggled="toggleLike"
          @loadedMore="loadMoreTracks(trackType)"
        />
      </div>
    </div>
  </div>
</template>
