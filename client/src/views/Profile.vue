<script setup lang="ts">
import TracksContainer from '../components/TracksContainer.vue'
import useProfile from '../composables/useProfile'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import moment from 'moment'
import useToggleLike from '../composables/useToggleLike'
import useAsyncWrap from '../composables/useAsyncWrap'
import { reactive } from 'vue'

const route = useRoute()
const authStore = useAuthStore()

const { id: profileId } = route.params as {
  id: string
}

const { profile, getProfile, toggleFollow, isLoading } = useProfile()

getProfile(profileId)

const toggleLike = useToggleLike()

function toggleTrackLike(track: Track) {
  const foundTrack = profile.value?.uploads.find(el => el._id === track._id)
  if (!foundTrack) return

  toggleLike(foundTrack)
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center">
      <div class="loader"></div>
    </div>
    <div v-else-if="!profile">NO PROFILE</div>
    <div v-else>
      <div class="base-container flex mb-8 relative">
        <button
          v-if="authStore.user && authStore.user._id === profile._id"
          @click="$router.push('/profile/' + '123' + '/edit')"
          class="absolute flex items-center gap-1 top-0 right-0 p-4"
        >
          <span>Edit</span>
        </button>
        <img class="image-large rounded-regular" />
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
              <p class="text-3xl font-semibold text-textPrimary">{{ profile.totalFollows }}</p>
            </div>
            <div class="bg-darkGrey p-4 rounded-regular">
              <p>Total uploads</p>
              <p class="text-3xl font-semibold text-textPrimary">{{ profile.totalUploads }}</p>
            </div>
            <div class="bg-darkGrey p-4 rounded-regular">
              <p>Specification</p>
              <p class="text-3xl font-semibold text-textPrimary">{{ profile.specification || 'None' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <h2 class="base-heading mb-4">Uploads</h2>
        <TracksContainer :tracks="profile.uploads" heading="Uploads" @like-toggled="toggleTrackLike" />
      </div>
    </div>
  </div>
</template>
