<script setup lang="ts">
import { ref, watch } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'
import useTracks from '../composables/useTracks'
import BasePopover from '../components/base/BasePopover.vue'
import useTrackFilters from '../composables/useTrackFilters'
import { ChevronDownIcon } from '../components/icons/index.vine'

// Track type logic
const TRACK_TYPES_BUTTONS = [
  { title: 'Beats', type: 'beat' as TrackType, urlSuffix: 'beats' },
  { title: 'Samples', type: 'sample' as TrackType, urlSuffix: 'samples' },
  { title: 'Drumkits', type: 'drumkit' as TrackType, urlSuffix: 'drumkits' },
]

const trackType = ref<TrackType>('beat')

const {
  tracks,
  getTracks,
  isLoading,
  toggleLike,
  isMore,
  loadMoreTracks,
  isLoadingMore,
} = useTracks()
const { currentFilters, activeFilters, removeFilter } =
  useTrackFilters(trackType)

// Fetch initial tracks
getTracks(trackType.value, {filters: {phrase: 'test'}})

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
            <ChevronDownIcon/>
          </template>
          <template #popover-content>
            <div v-if="filter.type === 'range'" class="flex gap-x-2">
              <input
                v-model="filter.value.min"
                type="text"
                class="base-input px-2 py-1 w-[100px]"
                placeholder="From"
              />
              <input
                v-model="filter.value.max"
                type="text"
                class="base-input px-2 py-1 w-[100px]"
                placeholder="To"
              />
            </div>
            <div v-if="filter.type === 'exact'" class="flex gap-x-2">
              <input
                v-model="filter.value"
                type="text"
                class="base-input px-2 py-1 w-[100px]"
                :placeholder="filter.label"
              />
            </div>
            <div v-if="filter.type === 'set'">
              <div class="flex flex-col max-h-[150px] overflow-y-scroll">
                <div
                  v-for="value of filter.values"
                  :key="value[0]"
                  class="base-checkbox"
                >
                  <input
                    v-model="value[1]"
                    type="checkbox"
                    :name="value[0]"
                    :id="value[0]"
                  />
                  <label :for="value[0]" class="p-2 text-nowrap">{{
                    value[0]
                  }}</label>
                </div>
              </div>
            </div>
          </template>
        </BasePopover>
      </div>
      <div class="w-4/5">
        <div class="grid grid-cols-3 gap-4 mb-2">
          <button
            v-for="btn in TRACK_TYPES_BUTTONS"
            @click="trackType = btn.type"
            :class="[trackType === btn.type ? 'base-btn' : 'base-btn-alt']"
          >
            {{ btn.title }}
          </button>
        </div>
        <div class="flex mb-2">
        <div v-for="filter in currentFilters">
          <p v-if="filter.type === 'exact' && filter.value" class="mr-4">
            <span class="text-textLightGrey">{{ filter.label }}:</span> <span class="active-filter-badge" @click="removeFilter(filter.id)">{{ filter.value }}</span>
          </p>
          <p v-if="filter.type === 'range' && (filter.value.min || filter.value.max)" class="mr-4">
            <span class="text-textLightGrey">{{ filter.label }}:</span>
            <span class="active-filter-badge" @click="removeFilter(filter.id)"
              >{{ (filter.value.min && filter.value.max) ? `${filter.value.min} - ${filter.value.max}` : (filter.value.min && !filter.value.max) ? `Above ${filter.value.min}` : `Below ${filter.value.max}` }}</span
            >
          </p>
          <p v-if="filter.type === 'set' && filter.values.filter(el => el[1]).length" class="flex mr-4">
            <span class="text-textLightGrey">{{ filter.label }}:</span>
            <div v-for="val in filter.values">
            <span v-if="val[1]" :key="val[0]" @click="removeFilter(filter.id, val[0])" class="active-filter-badge mr-1">{{ val[0] }}</span>
            </div>
          </p>
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
