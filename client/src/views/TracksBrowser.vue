<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import useTrackFilters from '../composables/useTrackFilters'
import FiltersPanel from '../components/FiltersPanel.vue'
import TracksContainer from '../components/TracksContainer.vue'
import useTracks from '../composables/useTracks'
import CurrentFilters from '../components/CurrentFilters.vue'
import debounce from '../utils/debounce'
import { useRoute, useRouter } from 'vue-router'
import BaseSelect from '../components/base/BaseSelect.vue'

const trackType = ref<TrackType>('all')

const { currentFilters, activeFilters, removeFilter } = useTrackFilters(trackType)
const { tracks, getTracks, loadMoreTracks, isLoading, isLoadingMore, isMore, toggleLike } = useTracks()

const route = useRoute()
const router = useRouter()

const query = route.query as { q?: string }

//initialize search phrase with whatever is in url query or empty string
const searchPhrase = ref(query.q || '')

//update query string in url when search term changes
watch(searchPhrase, newValue => {
  router.replace({ query: { ...route.query, q: newValue || undefined } })
})

//wrapper for getTracks
const getTracksWithFilters = () => {
  getTracks(trackType.value, { filters: { ...activeFilters.value, phrase: searchPhrase.value } })
}

//gets tracks after a delay
const debouncedGetTracks = debounce(() => {
  getTracksWithFilters()
}, 200)

//initial get tracks
getTracksWithFilters()

// Watch for filter changes
watch([activeFilters, searchPhrase], () => {
  //set isloading to true before deboune so spinner is shown when function is waiting for execution
  //no need to set it back to false as getTracks will do that for us

  route.query

  isLoading.value = true
  debouncedGetTracks()
})

const options = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Beats',
    value: 'beat',
  },
  {
    label: 'Samples',
    value: 'sample',
  },
  {
    label: 'Loops',
    value: 'loop',
  },
]
</script>

<template>
  <div>
    <div class="flex gap-x-8 mb-4">
      <BaseSelect v-model="trackType" :options="options" class="w-48" />
      <BaseSearchbar
        @search="phrase => (searchPhrase = phrase)"
        v-model="searchPhrase"
        :show-icon="true"
        :show-button="false"
        placeholder="Search"
        class="flex-1"
      />
    </div>
    <FiltersPanel :filters="currentFilters" class="mb-2" />
    <div class="min-h-8 mb-4">
      <CurrentFilters :filters="currentFilters" @remove-filter="removeFilter" />
    </div>
    <TracksContainer
      :tracks="tracks"
      :is-loading="isLoading"
      :is-more="isMore"
      :is-loading-more="isLoadingMore"
      @loaded-more="loadMoreTracks(trackType)"
      @like-toggled="toggleLike"
    />
  </div>
</template>
