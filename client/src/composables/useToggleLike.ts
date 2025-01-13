import appApi from '../api/appApi'
import useAsyncWrap from './useAsyncWrap'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

function useToggleLike() {
  const wrapToggleLike = useAsyncWrap()
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  function toggleLike(track: Track) {
    //check if user is authenticated
    if (!authStore.user) {
      toastStore.show({ type: 'info', title: 'Must be logged in to leave a like!' })
      return
    }

    ///modify state
    track.isLiked ? track.totalLikes-- : track.totalLikes++
    track.isLiked = !track.isLiked

    //send api request
    wrapToggleLike.run(async () => {
      await appApi.post(`/tracks/${track._id}/like`)
    })
  }
  return toggleLike
}

export default useToggleLike
