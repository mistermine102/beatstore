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
import { TRACK_TYPES } from '../constants'
import useToggleLike from '../composables/useToggleLike'
import LoginPromptModal from '../components/LoginPromptModal.vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const route = useRoute()
const router = useRouter()

const query = route.query as any

//initialize search phrase and track type with whatever is in url query or default value
const searchPhrase = ref(query.q || '')
const trackType = ref<TrackType>(query.type && TRACK_TYPES.includes(query.type) ? query.type : 'all')

const { currentFilters, activeFilters, removeFilter } = useTrackFilters(trackType, query)

const { tracks, getTracks, loadMoreTracks, isLoading, isLoadingMore, isMore } = useTracks()
const { toggleLike, showLoginPrompt } = useToggleLike()

//update query string in url and trigger search when either search phrase or track type changes
watch([searchPhrase, trackType], ([newSearchPhrase, newTrackType]) => {
  router.replace({
    query: {
      ...route.query,
      q: newSearchPhrase || undefined,
      type: newTrackType === 'all' ? undefined : newTrackType,
    },
  })

  isLoading.value = true
  debouncedGetTracks()
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
watch([activeFilters], () => {
  //get new tracks when filters change
  isLoading.value = true
  debouncedGetTracks()
})

//attach filters to url
watch(
  currentFilters,
  () => {
    const query: Record<string, any> = { ...route.query }

    currentFilters.value.forEach(filter => {
      switch (filter.type) {
        case 'exact':
          query[filter.id] = filter.value
          break
        case 'range':
          query[`${filter.id}[min]`] = undefined
          query[`${filter.id}[max]`] = undefined
          if (filter.value.min || filter.value.max) {
            if (filter.value.min) query[`${filter.id}[min]`] = filter.value.min
            if (filter.value.max) query[`${filter.id}[max]`] = filter.value.max
          }
          break
        case 'set':
          query[filter.id] = undefined
          if (filter.values.find(el => el[1])) {
            query[filter.id] = filter.values
              .filter(el => el[1])
              .map(el => el[0])
              .join(',')
          }
          break
      }
    })
    router.replace({ query })
  },
  { deep: true }
)

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
  <LoginPromptModal :is-open="showLoginPrompt" message="Log in to leave a like" @close="showLoginPrompt = false" />
  <ScreenWrapper>
    <div class="">
      <div class="flex flex-col gap-y-4 sm:flex-row sm:gap-x-8 mb-4">
        <BaseSelect v-model="trackType" :options="options" class="w-full sm:w-48" />
        <BaseSearchbar
          @search="phrase => (searchPhrase = phrase)"
          v-model="searchPhrase"
          :show-icon="true"
          :show-button="false"
          placeholder="Search"
          class="flex-1"
        />
      </div>
      <FiltersPanel :filters="currentFilters" />
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
  </ScreenWrapper>
</template>
