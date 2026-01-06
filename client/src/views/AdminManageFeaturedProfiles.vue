<script setup lang="ts">
import { ref } from 'vue'
import appApi from '../api/appApi'
import BaseButton from '../components/base/BaseButton.vue'
import useAsyncWrap from '../composables/useAsyncWrap'
import SelectListItem from '../components/common/SelectListItem.vue'
import ListModal from '../components/common/ListModal.vue'
import useTracks from '../composables/useTracks'
import { TrashIcon } from '../components/icons/index.vine'
import EmptyState from '../components/common/EmptyState.vue'
import useFeaturedProfiles from '../composables/useFeaturedProfiles'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

// Use the featured profiles composable
const {
  featuredProfiles,
  isLoadingFeaturedProfiles,
  isAddingFeaturedProfile,
  getFeaturedProfiles,
  addFeaturedProfile,
  deleteFeaturedProfile,
  formatFeaturedDate,
} = useFeaturedProfiles()

// Fetch featured profiles on component mount
getFeaturedProfiles()

//select profile
const isProfilesModalOpen = ref(false)
const profiles = ref<Profile[]>([])
const selectedProfile = ref<Profile | null>(null)

const wrapGetProfiles = useAsyncWrap()

function getProfiles() {
  wrapGetProfiles.run(async () => {
    const response = await appApi.get('/profile')
    profiles.value = response.data.profiles
  })
}

function openProfilesModal() {
  isProfilesModalOpen.value = true
  getProfiles()
}

function selectProfile(profile: Profile) {
  selectedTrack.value = null
  selectedProfile.value = profile
  isProfilesModalOpen.value = false
}

//select track
const isTracksModalOpen = ref(false)
const selectedTrack = ref<Track | null>(null)

const { tracks, getTracks, isLoading: isTracksLoading } = useTracks()

function openTracksModal() {
  isTracksModalOpen.value = true
  getTracks('all', { filters: { authorId: selectedProfile.value?._id } })
}

function selectTrack(track: Track) {
  selectedTrack.value = track
  isTracksModalOpen.value = false
}

//add featured profile handler
function handleAddFeaturedProfile(e: Event) {
  e.preventDefault()

  if (!selectedProfile.value || !selectedTrack.value) return

  addFeaturedProfile(selectedProfile.value._id, selectedTrack.value._id, 'infinite')
}

//is profile featured helper
function isProfileFeatured(profile: Profile) {
  return !!featuredProfiles.value.find(f => f.profile._id === profile._id)
}
</script>

<template>
  <ScreenWrapper>
    <ListModal
      :is-open="isProfilesModalOpen"
      title="Select profile"
      description="Please select a profile you want to add:"
      :is-loading="wrapGetProfiles.isLoading.value"
      @close="isProfilesModalOpen = false"
    >
      <SelectListItem
        v-for="profile in profiles"
        @click="selectProfile(profile)"
        :upper-text="`${profile.username} ${isProfileFeatured(profile) ? '(Featured)' : ''}`"
        :lower-text="profile._id"
        :right-text="`Uploads: ${profile.totalUploads.toString()}`"
        :is-selected="selectedProfile?._id === profile._id"
        :image-url="profile.image.url"
      />
    </ListModal>
    <ListModal
      :is-open="isTracksModalOpen"
      title="Select a track"
      description="Please select a track that will be displayed:"
      :is-loading="isTracksLoading"
      @close="isTracksModalOpen = false"
    >
      <SelectListItem
        v-for="track in tracks"
        @click="selectTrack(track)"
        :upper-text="track.title"
        :lower-text="track._id"
        :is-selected="selectedTrack?._id === track._id"
        :image-url="track.image.url"
      />
    </ListModal>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="panel order-2 lg:order-1">
        <h2 class="base-heading">Featured profiles</h2>
        <div v-if="isLoadingFeaturedProfiles" class="flex justify-center">
          <div class="loader"></div>
        </div>
        <EmptyState v-else-if="!featuredProfiles.length" />
        <div v-else class="flex flex-col gap-y-4">
          <div v-for="featured in featuredProfiles" class="flex gap-x-4 group">
            <div class="flex gap-x-2 relative w-full">
              <img :src="featured.profile.image.url" class="w-[50px] max-h-[50px] rounded-regular" />
              <div>
                <p>
                  <router-link :to="`/profile/${featured.profile._id}`">{{ featured.profile.username }}</router-link>
                  <span class="text-textLightGrey ml-2"
                    >with <router-link :to="`/track/${featured.track._id}`">{{ featured.track.title }}</router-link>
                  </span>
                </p>
                <p class="text-textLightGrey">Until: {{ formatFeaturedDate(featured.featuredUntil) }}</p>
              </div>
              <button
                @click="deleteFeaturedProfile(featured.profile._id, featured.track._id)"
                class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-150"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <form class="panel order-1 lg:order-2" @submit="handleAddFeaturedProfile">
        <h2 class="base-heading">Add featured profile</h2>
        <div class="flex flex-col gap-y-6 mb-8">
          <div class="flex gap-x-4 items-center justify-between">
            <div class="py-2 rounded-regular" :class="selectedProfile ? 'bg-background' : ''">
              <div v-if="selectedProfile" class="px-4">
                <p>{{ selectedProfile.username }}</p>
                <p class="text-textLightGrey">{{ selectedProfile._id }}</p>
              </div>
              <p v-else class="text-textLightGrey">No profile selected</p>
            </div>
            <BaseButton @click="openProfilesModal" alt type="button">Select profile</BaseButton>
          </div>
          <div class="flex gap-x-4 items-center justify-between" :class="!selectedProfile ? 'opacity-50' : ''">
            <div class="py-2 rounded-regular" :class="selectedTrack ? 'bg-background' : ''">
              <div v-if="selectedTrack" class="px-4">
                <p>{{ selectedTrack.title }}</p>
                <p class="text-textLightGrey">{{ selectedTrack._id }}</p>
              </div>
              <p v-else class="text-textLightGrey">No profile selected</p>
            </div>

            <BaseButton @click="openTracksModal" alt type="button" :disabled="!selectedProfile">Select upload</BaseButton>
          </div>
        </div>
        <BaseButton :is-loading="isAddingFeaturedProfile" :disabled="!selectedProfile || !selectedTrack">Add</BaseButton>
      </form>
    </div>
  </ScreenWrapper>
</template>
