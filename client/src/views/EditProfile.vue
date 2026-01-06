<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import useProfile from '../composables/useProfile'
import { useRoute, useRouter } from 'vue-router'
import UploadFileContainer from '../components/common/UploadFileContainer.vue'
import { ImageIcon, TrashIcon } from '../components/icons/index.vine'
import BaseButton from '../components/base/BaseButton.vue'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { useToastStore } from '../stores/toast'
import validator from 'validator'
import SocialLink from '../components/common/SocialLink.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import { GENERIC_ERROR_TOAST, PLATFORM_LABELS, PLATFORMS } from '../constants'
import EmptyState from '../components/common/EmptyState.vue'
import { useAuthStore } from '../stores/auth'
import BaseSwitch from '../components/base/BaseSwitch.vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const route = useRoute()
const router = useRouter()

const { user } = useAuthStore()

const NOTIFICATION_RULE_LABELS: Record<string, string> = {
  trackVerified: 'Upload verified',
  trackLiked: 'Upload liked',
  trackCommented: 'Upload commented',
}

const { id: profileId } = route.params as {
  id: string
}

const toastStore = useToastStore()

const { profile, getProfile, isLoading } = useProfile()

const editedProfile = ref({
  username: profile.value?.username || '',
  specification: profile.value?.specification || '',
  image: null as File | null,
  socialLinks: profile.value?.socialLinks || ([] as SocialLink[]),
  notificationRules: {} as Record<string, Record<string, boolean>>,
})

function validate() {
  //all of toasts in this function will be error toasts with this title
  const type: ToastType = 'error'
  const title = "Can't edit a profile"

  if (!validator.isLength(editedProfile.value.username, { min: 4 })) {
    toastStore.show({ type, title, message: 'Username must be at least 4 characters long' })
    return false
  }
  if (!validator.isLength(editedProfile.value.username, { max: 25 })) {
    toastStore.show({ type, title, message: 'Username must be less than 25 characters long' })
    return false
  }
  if (!validator.isLength(editedProfile.value.specification, { max: 50 })) {
    toastStore.show({ type, title, message: 'Specification must be less than 50 characters long' })
    return false
  }
  return true
}

const wrapEditProfile = useAsyncWrap()

function editProfile(e: Event) {
  e.preventDefault()
  if (!validate()) return

  wrapEditProfile.run(
    async () => {
      await appApi.patch('/profile', { ...editedProfile.value, image: null })

      if (editedProfile.value.image) {
        await appApi.postForm('/profile/image', { image: editedProfile.value.image })
      }

      toastStore.show({ type: 'success', title: 'Profile edited!' })
    },
    err => {
      if (err.response && err.response.data.message === 'USERNAME_NOT_AVAILABLE')
        return toastStore.show({ type: 'error', title: "Can't edit a profile", message: 'Username is not available' })
      return toastStore.show(GENERIC_ERROR_TOAST)
    }
  )
}

const wrapDeleteProfile = useAsyncWrap()

function deleteProfile() {
  wrapDeleteProfile.run(async () => {
    await appApi.delete('/profile')
    await router.push('/')
    location.reload()
  })
}

//platforms
const newSocialLink = reactive({
  url: '',
  platform: null as null | Platform,
})

function addNewSocialLink() {
  const { platform, url } = newSocialLink

  //validation
  const type = 'error' as ToastType
  const title = "Can't add a link"

  if (!platform) return toastStore.show({ type, title, message: 'Platform is required' })
  if (!url) return toastStore.show({ type, title, message: 'Url is required' })
  if (!validator.isURL(url)) return toastStore.show({ type, title, message: 'Invalid Url' })
  if (editedProfile.value.socialLinks.find(l => l.url === url)) return toastStore.show({ type, title, message: 'Url already added' })
  if (editedProfile.value.socialLinks.length >= 6) return toastStore.show({ type, title, message: 'Maximum number of link is 6' })

  //add new social link
  editedProfile.value.socialLinks.push({ platform, url })
}

onMounted(async () => {
  await getProfile(profileId)
  editedProfile.value.username = profile.value?.username || ''
  editedProfile.value.specification = profile.value?.specification || ''
  editedProfile.value.socialLinks = profile.value?.socialLinks || []
  editedProfile.value.notificationRules = user?.notificationRules || {}
})
</script>
<template>
  <ScreenWrapper>
    <div v-if="isLoading" class="flex justify-center">
      <div class="loader"></div>
    </div>
    <EmptyState v-else-if="!profile" />
    <div v-else>
      <h1 class="text-4xl font-secondary mb-8">Edit Your Profile</h1>
      <form @submit="editProfile">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="panel">
              <h2 class="text-2xl mb-6">Basic Information</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-textLightGrey mb-2">Username</label>
                  <input type="text" v-model="editedProfile.username" class="base-input w-full bg-background" placeholder="Enter your username" />
                </div>
                <div>
                  <label class="block text-textLightGrey mb-2">Specification</label>
                  <input
                    type="text"
                    v-model="editedProfile.specification"
                    class="base-input w-full bg-background"
                    placeholder="What do you specialize in?"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-8">
            <div class="panel h-full">
              <h2 class="text-2xl mb-4">Profile Image</h2>
              <UploadFileContainer
                @file-selected="file => (editedProfile.image = file ? file : null)"
                class="border-2 border-dashed border-white/[0.1] hover:border-primary transition-colors duration-150"
                id="image"
                max-file-size="25MB"
                accept="image/*"
              >
                <template #icon>
                  <div class="w-[48px]">
                    <ImageIcon />
                  </div>
                </template>
              </UploadFileContainer>
            </div>
          </div>
        </div>
        <div class="panel mt-8">
          <h2 class="base-heading">Links</h2>
          <div class="flex flex-col gap-y-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <BaseSelect
                v-model="newSocialLink.platform"
                :options="PLATFORMS.map(p => ({ value: p, label: PLATFORM_LABELS[p] }))"
                placeholder="Select a platform"
                class="[&>.popover-button]:bg-background w-64"
              />
              <input v-model="newSocialLink.url" type="text" class="base-input bg-background w-full" placeholder="Enter a url" />
              <BaseButton type="button" alt @click="addNewSocialLink" class="w-fit">Add</BaseButton>
            </div>
            <div v-for="link in editedProfile.socialLinks" class="flex gap-x-4 group">
              <SocialLink :link="link" />
              <button type="button" @click="editedProfile.socialLinks = editedProfile.socialLinks.filter(l => l.url !== link.url)">
                <TrashIcon class="text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="user" class="panel mt-8">
          <h2 class="base-heading">Notifications</h2>
          <div>
            <div v-for="[rule, media] in Object.entries(user.notificationRules)" class="mt-2">
              <h3 class="text-lg font-semibold">{{ NOTIFICATION_RULE_LABELS[rule] }}</h3>
              <div v-for="[medium] in Object.entries(media)" class="flex gap-x-2 items-center">
                <p class="text-textLightGrey">{{ medium[0].toUpperCase() + medium.slice(1) }}</p>
                <BaseSwitch v-model="editedProfile.notificationRules[rule][medium]" />
              </div>
            </div>
          </div>
        </div>
        <!-- Submit Button -->
        <BaseButton type="submit" :is-loading="wrapEditProfile.isLoading.value" class="mt-8">
          <div class="flex items-center justify-center gap-2">
            <span>Save Changes</span>
          </div>
        </BaseButton>
      </form>
      <div class="panel mt-8">
        <h2 class="text-2xl mb-6">Danger zone</h2>
        <BaseButton
          @click="deleteProfile"
          :is-loading="wrapDeleteProfile.isLoading.value"
          class="bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700"
          >Delete account</BaseButton
        >
      </div>
    </div>
  </ScreenWrapper>
</template>
