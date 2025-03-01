<script setup lang="ts">
import TracksContainer from '../components/TracksContainer.vue'
import useProfile from '../composables/useProfile'
import useTracks from '../composables/useTracks'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import moment from 'moment'
import { computed, ref, watch } from 'vue'

const route = useRoute()
const authStore = useAuthStore()
const showUnverified = ref(false)

const { id: profileId } = route.params as {
  id: string
}

const { profile, getProfile, toggleFollow, isLoading: isLoadingProfile } = useProfile()
const { tracks, toggleLike, isLoading: isLoadingTracks, getTracks, isMore, isLoadingMore, loadMoreTracks } = useTracks()

getProfile(profileId)
getTracks('all', { filters: { authorId: profileId } })

watch(
  () => route.params.id,
  () => {
    getProfile(profileId)
    getTracks('all', { filters: { authorId: profileId } })
  }
)

watch(showUnverified, () => {
  const filters: GetTracksFilters = {
    unverified: showUnverified.value ? true : undefined,
  }

  getTracks('all', { filters })
})

const isOwnProfile = computed(() => {
  return authStore.user && profile.value && authStore.user._id === profile.value._id
})
</script>

<template>
  <div>
    <div v-if="isLoadingProfile" class="flex justify-center">
      <div class="loader"></div>
    </div>
    <div v-else-if="!profile">NO PROFILE</div>
    <div v-else>
      <div class="base-container flex mb-8 relative">
        <button v-if="isOwnProfile" @click="$router.push(`/profile/${profile._id}/edit`)" class="absolute flex items-center gap-1 top-0 right-0 p-4">
          <span>Edit</span>
        </button>
        <img class="image-large rounded-regular" :src="profile.image.url" />
        <div class="ml-4 flex flex-col flex-1">
          <div>
            <h2 class="text-left text-4xl mb-1">{{ profile.username }}</h2>
            <p class="mb-4 text-textLightGrey">Joined {{ moment(profile.createdAt).format('LL') }}</p>
            <button @click="toggleFollow" class="base-btn mb-8" :class="[profile.isFollowed ? 'bg-textLightGrey' : '']">
              {{ profile.isFollowed ? 'Unfollow' : 'Follow' }}
            </button>
          </div>
          <div class="grid grid-cols-3 gap-8">
            <div class="bg-darkGrey p-4 rounded-regular">
              <p>Followers</p>
              <p class="text-3xl text-primary">{{ profile.totalFollows }}</p>
            </div>
            <div class="bg-darkGrey p-4 rounded-regular">
              <p>Total uploads</p>
              <p class="text-3xl text-primary">{{ profile.totalUploads }}</p>
            </div>
            <div class="bg-darkGrey p-4 rounded-regular">
              <p>Specification</p>
              <p class="text-3xl text-primary">{{ profile.specification || 'None' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <div class="flex items-baseline gap-x-2">
          <h2 class="base-heading">Uploads</h2>
          <button v-if="isOwnProfile" @click="showUnverified = !showUnverified" class="text-textLightGrey">{{ showUnverified ? 'Hide' : 'Show'}} unverified</button>
        </div>
        <TracksContainer
          :tracks="tracks"
          :is-loading="isLoadingTracks"
          :is-loading-more="isLoadingMore"
          :is-more="isMore"
          @loaded-more="loadMoreTracks('all', { filters: { authorId: profileId } })"
          heading="Uploads"
          @like-toggled="toggleLike"
        />
      </div>
    </div>
  </div>
</template>
