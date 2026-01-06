<script setup lang="ts">
import TracksContainer from '../components/tracks/TracksContainer.vue'
import useProfile from '../composables/useProfile'
import useTracks from '../composables/useTracks'
import useToggleLike from '../composables/useToggleLike'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import moment from 'moment'
import { computed, ref, watch } from 'vue'
import LoginPromptModal from '../components/auth/LoginPromptModal.vue'
import BaseButton from '../components/base/BaseButton.vue'
import { UploadIcon, PencilIcon } from '../components/icons/index.vine'
import SocialLink from '../components/common/SocialLink.vue'
import EmptyState from '../components/common/EmptyState.vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const route = useRoute()
const authStore = useAuthStore()
const showUnverified = ref(false)

const profileId = ref(route.params.id as string)

const { profile, getProfile, toggleFollow, isLoading: isLoadingProfile, showLoginPrompt: followLoginPrompt, isFollowLoading } = useProfile()
const { tracks, isLoading: isLoadingTracks, getTracks, isMore, isLoadingMore, loadMoreTracks } = useTracks()
const { toggleLike, showLoginPrompt: likeLoginPrompt } = useToggleLike()

function handleLike(track: Track) {
  toggleLike(track)
}

getProfile(profileId.value)
getTracks('all', { filters: { authorId: profileId.value } })

watch(
  () => route.params.id,
  () => {
    profileId.value = route.params.id as string
    getProfile(profileId.value)
    getTracks('all', { filters: { authorId: profileId.value } })
  }
)

watch(showUnverified, () => {
  const filters: GetTracksFilters = {
    unverified: showUnverified.value ? true : undefined,
    authorId: profileId.value
  }

  getTracks('all', { filters })
})

const isOwnProfile = computed(() => {
  return authStore.user && profile.value && authStore.user._id === profile.value._id
})
</script>

<template>
  <ScreenWrapper>
    <div v-if="isLoadingProfile" class="flex justify-center">
      <div class="loader"></div>
    </div>
    <EmptyState v-else-if="!profile" />
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div class="panel flex relative lg:col-span-3">
          <router-link v-if="isOwnProfile" :to="`/profile/${profile._id}/edit`" class="absolute top-4 right-4">
            <PencilIcon class="clickable-icon" />
          </router-link>
          <img class="w-[200px] h-[200px] rounded-regular" :src="profile.image.url" />
          <div class="ml-4 flex flex-col flex-1">
            <div>
              <h2 class="text-left text-4xl mb-1 font-secondary">{{ profile.username }}</h2>
              <p class="mb-4 text-textLightGrey">Joined {{ moment(profile.createdAt).format('LL') }}</p>
              <BaseButton @click="toggleFollow" :is-loading="isFollowLoading" class="mb-8" :alt="profile.isFollowed">
                {{ profile.isFollowed ? 'Unfollow' : 'Follow' }}
              </BaseButton>
            </div>
          </div>
        </div>
        <div class="panel lg:col-span-2 p-4">
          <h3 class="text-xl font-bold mb-4">Connect With Me</h3>
          <EmptyState v-if="!profile.socialLinks.length" />
          <div v-else class="flex flex-col gap-y-4 w-full overflow-hidden">
            <SocialLink v-for="link in profile.socialLinks" :link="link" />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-8 mb-8">
        <div class="panel p-4 sm:p-8">
          <p class="text-textLightGrey">Followers</p>
          <p class="text-[32px] font-secondary">{{ profile.totalFollows }}</p>
        </div>
        <div class="panel p-4 sm:p-8">
          <p class="text-textLightGrey">Total uploads</p>
          <p class="text-[32px] font-secondary">{{ profile.totalUploads }}</p>
        </div>
        <div class="panel p-4 sm:p-8">
          <p class="text-textLightGrey">Specification</p>
          <p class="text-[32px] font-secondary truncate">{{ profile.specification || 'None' }}</p>
        </div>
      </div>
      <div class="space-y-6">
        <!-- Section Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-x-4">
            <h2 class="text-2xl font-bold">Uploads</h2>
            <BaseButton v-if="isOwnProfile" @click="showUnverified = !showUnverified" size="small" alt :class="showUnverified ? 'text-primary' : ''">
              {{ showUnverified ? 'Hide Unverified' : 'Show Unverified' }}
            </BaseButton>
          </div>
          <BaseButton v-if="isOwnProfile" @click="$router.push('/upload')">
            <div class="flex items-center gap-x-2">
              <span>Upload</span>
              <UploadIcon :size="20" />
            </div>
          </BaseButton>
        </div>

        <!-- Tracks Grid -->
        <TracksContainer
          :tracks="tracks"
          :is-loading="isLoadingTracks"
          :is-loading-more="isLoadingMore"
          :is-more="isMore"
          @loaded-more="loadMoreTracks('all', { filters: { authorId: profileId } })"
          @like-toggled="handleLike"
        />
      </div>
    </div>

    <LoginPromptModal :is-open="followLoginPrompt" message="Log in to follow this profile" @close="followLoginPrompt = false" />
    <LoginPromptModal :is-open="likeLoginPrompt" message="Log in to leave a like" @close="likeLoginPrompt = false" />
  </ScreenWrapper>
</template>
