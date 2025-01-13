import { ref } from 'vue'
import appApi from '../api/appApi'
import useAsyncWrap from './useAsyncWrap'
import useToggleLike from './useToggleLike'

export default function useTracks() {
  const wrapGetTracks = useAsyncWrap()
  const toggleLike = useToggleLike()

  const tracks = ref<Track[]>([])

  async function getTracks(type: TrackType) {
    await wrapGetTracks.run(async () => {
      const response = await appApi.get<{ tracks: Track[] }>(`/tracks/${type}`)
      tracks.value = response.data.tracks
    })
  }

  return {
    tracks,
    isLoading: wrapGetTracks.isLoading,
    getTracks,
    toggleLike,
  }
}
