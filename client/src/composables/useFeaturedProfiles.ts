import { ref } from 'vue'
import appApi from '../api/appApi'
import useAsyncWrap from './useAsyncWrap'
import moment from 'moment'

export interface FeaturedProfile {
  _id: string
  profile: Profile
  track: PlayableTrack
  featuredUntil: Date
}

export default function useFeaturedProfiles() {
  const featuredProfiles = ref<FeaturedProfile[]>([])
  const { run: wrapGetFeaturedProfiles, isLoading: isLoadingFeaturedProfiles } = useAsyncWrap()
  const { run: wrapAddFeaturedProfile, isLoading: isAddingFeaturedProfile } = useAsyncWrap()
  const { run: wrapDeleteFeaturedProfile, isLoading: isDeletingFeaturedProfile } = useAsyncWrap()

  /**
   * Fetch featured profiles from the API
   */
  const getFeaturedProfiles = () => {
    return wrapGetFeaturedProfiles(async () => {
      const response = await appApi.get('/profile/featured')
      featuredProfiles.value = response.data.featuredProfiles
      return featuredProfiles.value
    })
  }

  /**
   * Add a profile to featured profiles
   * @param profileId - The ID of the profile to feature
   * @param trackId - The ID of the track to display
   * @param duration - How long to feature the profile ('1week', '1month', 'infinite')
   */
  const addFeaturedProfile = (profileId: string, trackId: string, duration: '1week' | '1month' | 'infinite' = 'infinite') => {
    return wrapAddFeaturedProfile(async () => {
      const response = await appApi.post('/profile/featured', {
        profileId,
        trackId,
        duration,
      })

      // Refresh the list after adding
      await getFeaturedProfiles()

      return response.data
    })
  }

  /**
   * Remove a profile from featured profiles
   * @param profileId - The ID of the profile to remove
   * @param trackId - The ID of the track
   */
  const deleteFeaturedProfile = (profileId: string, trackId: string) => {
    return wrapDeleteFeaturedProfile(async () => {
      const response = await appApi.delete('/profile/featured', {
        data: {
          profileId,
          trackId,
        },
      })

      // Refresh the list after removing
      await getFeaturedProfiles()

      return response.data
    })
  }

  /**
   * Format the featuredUntil date
   * @param date - The date to format
   * @param format - The format to use (default: "DD.MM.YYYY, HH:mm")
   */
  const formatFeaturedDate = (date: Date, format: string = 'DD.MM.YYYY, HH:mm') => {
    return moment(date).format(format)
  }

  return {
    // State
    featuredProfiles,

    // Loading states
    isLoadingFeaturedProfiles,
    isAddingFeaturedProfile,
    isDeletingFeaturedProfile,

    // Methods
    getFeaturedProfiles,
    addFeaturedProfile,
    deleteFeaturedProfile,
    formatFeaturedDate,
  }
}
