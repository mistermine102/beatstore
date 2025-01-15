<script setup lang="ts">
import { ref, watch } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'
import useTracks from '../composables/useTracks'
import BasePopover from '../components/base/BasePopover.vue'
import useTrackFilters from '../composables/useTrackFilters'

// Track type logic
const TRACK_TYPES_BUTTONS = [
  { title: 'Beats', type: 'beat' as TrackType, urlSuffix: 'beats' },
  { title: 'Samples', type: 'sample' as TrackType, urlSuffix: 'samples' },
  { title: 'Drumkits', type: 'drumkit' as TrackType, urlSuffix: 'drumkits' },
]

const trackType = ref<TrackType>('beat')

const { tracks, getTracks, isLoading, toggleLike, isMore, loadMoreTracks, isLoadingMore } = useTracks()
const { currentFilters, activeFilters, removeFilter } = useTrackFilters(trackType)


// Fetch initial tracks
getTracks(trackType.value)

// Watch for filter changes
watch(activeFilters, () => {
  getTracks(trackType.value, { filters: activeFilters.value })
})
</script>

<template>
  <div class="h-full">
    <FrontpageHero />
    <BaseSearchbar />
    <div class="flex gap-8 mt-16">
      <div class="w-1/5">
        <BasePopover v-for="filter in currentFilters">
          <template #popover-button>
            <p>{{ filter.label }}</p>
          </template>
          <template #popover-content>
            <div v-if="filter.type === 'range'" class="flex gap-x-2">
              <input v-model="filter.value.min" type="text" class="base-input px-2 py-1 w-[100px]" placeholder="From" />
              <input v-model="filter.value.max" type="text" class="base-input px-2 py-1 w-[100px]" placeholder="To" />
            </div>
            <div v-if="filter.type === 'exact'" class="flex gap-x-2">
              <input v-model="filter.value" type="text" class="base-input px-2 py-1 w-[100px]" :placeholder="filter.label" />
            </div>
          </template>
        </BasePopover>
      </div>
      <div class="w-4/5">
        <div class="grid grid-cols-3 gap-4 mb-4">
          <button v-for="btn in TRACK_TYPES_BUTTONS" @click="trackType = btn.type" :class="[trackType === btn.type ? 'base-btn' : 'base-btn-alt']">
            {{ btn.title }}
          </button>
        </div>
        <div>
          <div v-for="filter in currentFilters">
            <div v-if="filter.value" class="cursor-pointer" @click="removeFilter(filter.id)">
              <p v-if="filter.type === 'exact'">
                <span>{{ filter.label }}: {{ filter.value }}</span>
              </p>
              <p v-if="filter.type === 'range'">
                <span v-if="filter.value.min && filter.value.max">{{ filter.label }}: {{ filter.value.min }} - {{ filter.value.max }}</span>
                <span v-if="filter.value.min && !filter.value.max">{{ filter.label }}: Above {{ filter.value.min }}</span>
                <span v-if="filter.value.max && !filter.value.min">{{ filter.label }}: Below {{ filter.value.max }}</span>
              </p>
            </div>
          </div>
        </div>
        <TracksContainer
          :tracks="tracks"
          :isLoading="isLoading"
          :isLoadingMore="isLoadingMore"
          :isMore="isMore"
          @likeToggled="toggleLike"
          @loadedMore="loadMoreTracks(trackType, { filters: activeFilters })"
        />
      </div>
    </div>
  </div>
</template>
