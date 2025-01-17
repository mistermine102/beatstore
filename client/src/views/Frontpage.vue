<script setup lang="ts">
import { ref, watch } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'
import useTracks from '../composables/useTracks'
import useTrackFilters from '../composables/useTrackFilters'
import FiltersPanel from '../components/FiltersPanel.vue'
import debounce from '../utils/debounce'
import { useRouter } from 'vue-router'
import CurrentFilters from '../components/CurrentFilters.vue'

// Track type logic
const TRACK_TYPES_BUTTONS = [
  { title: 'Beats', type: 'beat' as TrackType },
  { title: 'Samples', type: 'sample' as TrackType },
  { title: 'Drumkits', type: 'drumkit' as TrackType },
]

const router = useRouter()

const trackType = ref<TrackType>('beat')

const { tracks, getTracks, isLoading, toggleLike, isMore, loadMoreTracks, isLoadingMore } = useTracks()
const { currentFilters, activeFilters, removeFilter } = useTrackFilters(trackType)

// Fetch initial tracks
getTracks(trackType.value)

const debouncedGetTracks = debounce(() => {
  getTracks(trackType.value, { filters: activeFilters.value })
}, 200)

// Watch for filter changes
watch(activeFilters, () => {
  //set isloading to true before deboune so spinner is shown when function is waiting for execution
  //no need to set it back to false as getTracks will do that for us
  isLoading.value = true
  debouncedGetTracks()
})
</script>

<template>
  <div class="h-full">
    <FrontpageHero />
    <BaseSearchbar @search="(phrase) => router.push(`/search/${phrase}`)" />
    <div class="flex flex-col gap-8 mt-16">
      <div>
        <div class="grid grid-cols-3 gap-4 mb-2">
          <button v-for="btn in TRACK_TYPES_BUTTONS" @click="trackType = btn.type" :class="[trackType === btn.type ? 'base-btn' : 'base-btn-alt']">
            {{ btn.title }}
          </button>
        </div>
        <FiltersPanel class="flex gap-x-8 mb-1" :filters="currentFilters" />
        <CurrentFilters :filters="currentFilters" @removeFilter="removeFilter" />
        <TracksContainer :tracks="tracks" :isLoading="isLoading" :isLoadingMore="isLoadingMore" :isMore="isMore" @likeToggled="toggleLike" @loadedMore="loadMoreTracks(trackType, { filters: activeFilters })" />
      </div>
    </div>
  </div>
</template>
