import { computed, ref, watch, type Ref } from 'vue'
import { GENRES, INSTRUMENTS, KEYS, MOODS } from '../constants'

export default function useFilters(trackType: Ref<TrackType>, query?: any) {
  // Define the filters
  const bpmFilter = ref<Filter>({
    id: 'bpm',
    type: 'range',
    label: 'Bpm',
    value: { min: '', max: '' },
  })

  const keyFilter = ref<Filter>({
    id: 'key',
    type: 'set',
    label: 'Keys',
    values: KEYS.map(el => [el, false]),
  })

  const genreFilter = ref<Filter>({
    id: 'genre',
    type: 'set',
    label: 'Genres',
    values: GENRES.map(el => [el, false]),
  })

  const instrumentsFilter = ref<Filter>({
    id: 'instruments',
    type: 'set',
    label: 'Instruments',
    values: INSTRUMENTS.map(el => [el, false]),
  })

  const moodFilter = ref<Filter>({
    id: 'mood',
    type: 'set',
    label: 'Mood',
    values: MOODS.map(el => [el, false]),
  })

  // Define filters for each track type
  const AllFilters: Filter[] = [bpmFilter.value, keyFilter.value, genreFilter.value, instrumentsFilter.value, moodFilter.value]
  const BeatFilters: Filter[] = [bpmFilter.value, keyFilter.value, genreFilter.value, instrumentsFilter.value, moodFilter.value]
  const SampleFilters: Filter[] = [bpmFilter.value, keyFilter.value, instrumentsFilter.value, moodFilter.value]
  const LoopFilters: Filter[] = [bpmFilter.value, keyFilter.value, instrumentsFilter.value, moodFilter.value]
  const DrumkitFilters: Filter[] = []

  const filters = {
    beat: BeatFilters,
    sample: SampleFilters,
    drumkit: DrumkitFilters,
    loop: LoopFilters,
    all: AllFilters,
  }

  // Reactive reference for the current filters
  const currentFilters = ref<Filter[]>(filters[trackType.value as keyof typeof filters])

  //get filters from query
  getFiltersFromQuery()

  // Update `currentFilters` when `trackType` changes
  watch(trackType, () => {
    currentFilters.value = filters[trackType.value as keyof typeof filters]
  })

  // Computed property for active filters
  const activeFilters = computed(() => {
    const filterObject: Record<string, any> = {}

    for (const filter of currentFilters.value) {
      switch (filter.type) {
        case 'exact':
          if (filter.value) filterObject[filter.id] = filter.value
          break
        case 'range':
          if (filter.value.min || filter.value.max) {
            filterObject[filter.id] = {}
            if (filter.value.min) filterObject[filter.id].min = filter.value.min
            if (filter.value.max) filterObject[filter.id].max = filter.value.max
          }
          break
        case 'set':
          if (filter.values.find(el => el[1])) {
            filterObject[filter.id] = filter.values
              .filter(el => el[1])
              .map(el => el[0])
              .join(',')
          }
          break
      }
    }

    return filterObject
  })

  // Function to remove a filter
  function removeFilter(filterId: string, value?: string) {
    const filter = currentFilters.value.find(el => el.id === filterId)
    if (!filter) return

    switch (filter.type) {
      case 'exact':
        filter.value = ''
        break
      case 'range':
        filter.value.min = ''
        filter.value.max = ''
        break
      case 'set':
        filter.values.find(el => el[0] === value)![1] = false
        break
    }
  }

  function getFiltersFromQuery() {
    if (!query) return

    for (const filter of currentFilters.value) {
      switch (filter.type) {
        case 'exact':
          if (query[filter.id]) filter.value = query[filter.id]
          break
        case 'range':
          if (query[`${filter.id}[min]`]) filter.value.min = query[`${filter.id}[min]`]
          if (query[`${filter.id}[max]`]) filter.value.max = query[`${filter.id}[max]`]
          break
        case 'set':
          if (query[filter.id]) {
            const parsedValues = (query[filter.id] as string).split(',')
            filter.values.forEach(val => {
              if (parsedValues.includes(val[0])) val[1] = true
            })
          }
          break
      }
    }
  }

  return {
    currentFilters,
    activeFilters,
    removeFilter,
  }
}
