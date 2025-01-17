import { computed, ref, watch, type Ref } from 'vue'

export default function useFilters(trackType: Ref<TrackType>) {
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
    values: [
      ['A Major', false],
      ['A Minor', false],
      ['A# Major', false],
      ['A# Minor', false],
      ['B Major', false],
      ['B Minor', false],
      ['C Major', false],
      ['C Minor', false],
      ['C# Major', false],
      ['C# Minor', false],
      ['D Major', false],
      ['D Minor', false],
      ['D# Major', false],
      ['D# Minor', false],
      ['E Major', false],
      ['E Minor', false],
      ['F Major', false],
      ['F Minor', false],
      ['F# Major', false],
      ['F# Minor', false],
      ['G Major', false],
      ['G Minor', false],
      ['G# Major', false],
      ['G# Minor', false],
    ],
  })

  const genreFilter = ref<Filter>({
    id: 'genre',
    type: 'set',
    label: 'Genres',
    values: [
      ['Trap', false],
      ['BoomBap', false],
      ['Rage', false],
      ['Drill', false],
      ['Hip Hop', false],
      ['Pop', false],
      ['Rock', false],
      ['Jazz', false],
      ['Classical', false],
      ['Electronic', false],
      ['House', false],
      ['Techno', false],
    ],
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
          if (filter.values.find((el) => el[1])) {
            filterObject[filter.id] = filter.values
              .filter((el) => el[1])
              .map((el) => el[0])
              .join(',')
          }
          break
      }
    }

    return filterObject
  })

  // Function to remove a filter
  function removeFilter(filterId: string, value?: string) {
    const filter = currentFilters.value.find((el) => el.id === filterId)
    if (!filter) return console.log('NO FILTER FOUND')

    switch (filter.type) {
      case 'exact':
        filter.value = ''
        break
      case 'range':
        filter.value.min = ''
        filter.value.max = ''
        break
      case 'set':
        filter.values.find((el) => el[0] === value)![1] = false
        break
    }
  }

  return {
    currentFilters,
    activeFilters,
    removeFilter,
  }
}
