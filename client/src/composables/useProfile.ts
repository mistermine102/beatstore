import { ref, type Ref } from 'vue'
import appApi from '../api/appApi'
import useAsyncWrap from './useAsyncWrap'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

function useProfile() {
  const profile = ref<Profile | null>(null)

  const authStore = useAuthStore()
  const toastStore = useToastStore()

  const wrapGetProfile = useAsyncWrap()

  function getProfile(profileId: string, uploadsTarget?: Ref<Track[]>) {
    wrapGetProfile.run(async () => {
      const { data } = await appApi.get<{ profile: Profile }>(`/profile/${profileId}`)
      profile.value = data.profile
      
      if (uploadsTarget) {
        uploadsTarget.value = profile.value.uploads
      }
    })
  }

  const wrapToggleFollow = useAsyncWrap()

  function toggleFollow() {
    if (!profile.value) return

    if (!authStore.user) {
      toastStore.show({ type: 'info', title: 'Must be logged in to follow!' })
      return
    }

    wrapToggleFollow.run(async () => {
      if (!profile.value) return

      await appApi.post(`/profile/${profile.value?._id}/follow`)
      toastStore.show({
        title: profile.value.isFollowed ? 'Unfollowed!' : 'Followed!',
        type: profile.value.isFollowed ? 'info' : 'success',
      })

      //if a profile is follewed when we toggle that means we unfollow
      profile.value.isFollowed ? profile.value.totalFollows-- : profile.value.totalFollows++
      profile.value.isFollowed = !profile.value.isFollowed
    })
  }

  return {
    profile,
    getProfile,
    isLoading: wrapGetProfile.isLoading,
    toggleFollow,
  }
}

export default useProfile
