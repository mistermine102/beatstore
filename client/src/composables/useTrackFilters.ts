import { computed, ref, watch, type Ref } from 'vue'

// Define the filter interfaces
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

export default function useFilters(trackType: Ref<string>) {
  // Define the filters
  const bpmFilter = ref<Filter>({
    id: 'bpm',
    type: 'range',
    label: 'Bpm',
    value: { min: '', max: '' },
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

  // Define filters for each track type
  const BeatFilters: Filter[] = [bpmFilter.value, keyFilter.value, genreFilter.value]
  const SampleFilters: Filter[] = [bpmFilter.value, keyFilter.value]
  const DrumkitFilters: Filter[] = []
  
  const filters = {
    beat: BeatFilters,
    sample: SampleFilters,
    drumkit: DrumkitFilters,
  }

  // Reactive reference for the current filters
  const currentFilters = ref<Filter[]>(filters[trackType.value as keyof typeof filters])

  // Update `currentFilters` when `trackType` changes
  watch(trackType, () => {
    currentFilters.value = filters[trackType.value as keyof typeof filters]
  })

  // Computed property for active filters
  const activeFilters = computed(() => {
    const filterObject: Record<string, any> = {}
    const filterSchema = filters[trackType.value as keyof typeof filters]

    for (const filter of filterSchema) {
      switch (filter.type) {
        case 'exact':
          if (filter.value) filterObject[filter.id] = filter.value
          break
        case 'range':
          filterObject[filter.id] = {}
          if (filter.value.min) filterObject[filter.id].min = filter.value.min
          if (filter.value.max) filterObject[filter.id].max = filter.value.max
          break
      }
    }

    return filterObject
  })

  // Function to remove a filter
  function removeFilter(filterId: string) {
    const filter = currentFilters.value.find(el => el.id === filterId)
    if (!filter) return console.log('NO FILTER FOUND')

    switch (filter.type) {
      case 'exact':
        filter.value = ''
        break
      case 'range':
        filter.value.min = ''
        filter.value.max = ''
        break
    }
  }

  return {
    currentFilters,
    activeFilters,
    removeFilter,
  }
}
