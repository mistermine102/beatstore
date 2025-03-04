import { ref, type Ref } from 'vue'
import appApi from '../api/appApi'
import useAsyncWrap from './useAsyncWrap'
import { useAuthStore } from '../stores/auth'

function useProfile() {
  const profile = ref<Profile | null>(null)
  const showLoginPrompt = ref(false)

  const authStore = useAuthStore()

  const wrapGetProfile = useAsyncWrap()

  async function getProfile(profileId: string) {
    await wrapGetProfile.run(async () => {
      const profileResponse = await appApi.get<{ profile: Profile }>(`/profile/${profileId}`)
      profile.value = profileResponse.data.profile
    })
  }

  const wrapToggleFollow = useAsyncWrap()

  function toggleFollow() {
    if (!profile.value) return

    if (!authStore.user) {
      showLoginPrompt.value = true
      return
    }

    wrapToggleFollow.run(async () => {
      if (!profile.value) return

      await appApi.post(`/profile/${profile.value?._id}/follow`)

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
    showLoginPrompt,
    isFollowLoading: wrapToggleFollow.isLoading
  }
}

export default useProfile
