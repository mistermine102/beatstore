import appApi from '../api/appApi'
import useAsyncWrap from './useAsyncWrap'
import { useAuthStore } from '../stores/auth'
import { ref } from 'vue'

function useToggleLike() {
  const wrapToggleLike = useAsyncWrap()
  const authStore = useAuthStore()
  const showLoginPrompt = ref(false)

  function toggleLike(track: Track) {
    //check if user is authenticated
    if (!authStore.user) {
      showLoginPrompt.value = true
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
  return {
    toggleLike,
    showLoginPrompt
  }
}

export default useToggleLike
