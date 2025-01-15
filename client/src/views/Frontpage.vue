<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'
import useTracks from '../composables/useTracks'
import BasePopover from '../components/base/BasePopover.vue'

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

const { tracks, getTracks, isLoading, toggleLike, isMore, loadMoreTracks, isLoadingMore } = useTracks()
const trackType = ref<TrackType>('beat')

interface BaseFilter {
  id: string
  type: string
  label: string
}

interface RangeFilter extends BaseFilter {
  type: 'range'
  value: {
    min: string
    max: string
  }
}

interface ExactFilter extends BaseFilter {
  type: 'exact'
  value: string
}

type Filter = RangeFilter | ExactFilter

const bpmFilter = ref<Filter>({
  id: 'bpm',
  type: 'range',
  label: 'Bpm',
  value: {
    min: '',
    max: '',
  },
})

const keyFilter = ref<Filter>({
  id: 'key',
  type: 'exact',
  label: 'Key',
  value: '',
})

const genreFilter = ref<Filter>({
  id: 'genre',
  type: 'exact',
  label: 'Genre',
  value: '',
})

const BeatFilters: Filter[] = [bpmFilter.value, keyFilter.value, genreFilter.value]
const SampleFilters: Filter[] = [bpmFilter.value, keyFilter.value]
const DrumkitFilters: Filter[] = []

const filters = {
  beat: BeatFilters,
  sample: SampleFilters,
  drumkit: DrumkitFilters,
}

//initial get tracks
getTracks(trackType.value)

//filters logic
const currentFilters = ref<Filter[]>(BeatFilters)

// Computed property that returns the filters object, excluding empty strings
const activeFilters = computed(() => {
  const filterObject: any = {}
  const filterSchema = filters[trackType.value]

  for (const filter of filterSchema) {
    switch (filter.type) {
      case 'exact':
        // If the filter is 'exact', add it to the object if it's not empty
        if (filter.value) filterObject[filter.id] = filter.value
        break
      case 'range':
        // If the filter is 'range', add min and max values if they exist
        filterObject[filter.id] = {}
        if (filter.value.min) filterObject[filter.id].min = filter.value.min
        if (filter.value.max) filterObject[filter.id].max = filter.value.max
        break
    }
  }

  return filterObject
})

function removeFilter(filterId: string) {
  const filter = currentFilters.value.find(el => el.id === filterId)
  if (!filter) return console.log('NO FILTER FOUND')

  switch (filter.type) {
    case 'exact':
      filter.value = ''
      return
    case 'range':
      filter.value.min = ''
      filter.value.max = ''
      return
  }
}

//get new tracks when track type changes
watch(trackType, () => {
  currentFilters.value = filters[trackType.value]
  getTracks(trackType.value, { filters: activeFilters.value })
})

watch(
  currentFilters,
  () => {
    getTracks(trackType.value, { filters: activeFilters.value })
  },
  { deep: true }
)
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
