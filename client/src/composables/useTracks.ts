import { ref } from 'vue'
import appApi from '../api/appApi'
import useAsyncWrap from './useAsyncWrap'
import useToggleLike from './useToggleLike'

export default function useTracks() {


  const wrapGetTracks = useAsyncWrap()
  const wrapLoadMore = useAsyncWrap()
  const toggleLike = useToggleLike()

  const tracks = ref<Track[]>([])
  const isMore = ref(false)

  function getTracks(type: TrackType, options?: { filters?: GetTracksFilters }) {
    wrapGetTracks.run(async () => {
      const filters = options && options.filters ? options.filters : {}

      const response = await appApi.get<{ tracks: Track[]; isMore: boolean }>(`/tracks/${type}`, {
        params: filters,
      })

      tracks.value = response.data.tracks
      isMore.value = response.data.isMore
    })
  }

  function loadMoreTracks(type: TrackType, options?: { filters?: GetTracksFilters }) {
    wrapLoadMore.run(async () => {
      const filters = options && options.filters ? options.filters : {}

      const response = await appApi.get<{ tracks: Track[]; isMore: boolean }>(`/tracks/${type}?start=${tracks.value.length}`, {
        params: filters,
      })

      tracks.value = tracks.value.concat(response.data.tracks)
      isMore.value = response.data.isMore
    })
  }

  return {
    tracks,
    isLoading: wrapGetTracks.isLoading,
    isLoadingMore: wrapLoadMore.isLoading,
    getTracks,
    loadMoreTracks,
    isMore,
    toggleLike,
  }
}
