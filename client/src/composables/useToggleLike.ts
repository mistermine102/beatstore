import appApi from '../api/appApi'
import useAsyncWrap from './useAsyncWrap'
import useToggleProperty from './useToggleProperty'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

function useToggleTrackLike() {
  const toggleProperty = useToggleProperty()
  const wrapToggleLike = useAsyncWrap()
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  function toggleTrackLike(track: Track) {
    //check if user is authenticated
    if (!authStore.user) {
      toastStore.show({ type: 'info', title: 'Must be logged in to leave a like!' })
      return
    }

    //toggle property
    toggleProperty(track, 'isLiked', 'totalLikes')

    //send api request
    wrapToggleLike.run(async () => {
      await appApi.post(`/tracks/${track._id}/like`)
    })
  }
  return toggleTrackLike
}

export default useToggleTrackLike
