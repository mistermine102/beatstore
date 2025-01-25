<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useProfile from '../composables/useProfile'
import { useRoute } from 'vue-router'
import UploadFileContainer from '../components/UploadFileContainer.vue'
import { ImageIcon } from '../components/icons/index.vine'
import BaseButton from '../components/base/BaseButton.vue'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const { id: profileId } = route.params as {
  id: string
}

const toastStore = useToastStore()

const { profile, getProfile, isLoading } = useProfile()

const editedProfile = ref({
  username: profile.value?.username || '',
  specification: profile.value?.specification || '',
  image: null as File | null,
})

const wrapEditProfile = useAsyncWrap()

function editProfile(e: Event) {
  e.preventDefault()

  wrapEditProfile.run(async () => {
    await appApi.patch('/profile', { ...editedProfile.value, image: null })

    if (editedProfile.value.image) {
      await appApi.postForm('/profile/image', { image: editedProfile.value.image })
    }

    toastStore.show({type: 'success', title: "Profile edited!"})
  })
}

onMounted(async () => {
  await getProfile(profileId)
  editedProfile.value.username = profile.value?.username || ''
  editedProfile.value.specification = profile.value?.specification || ''
})
</script>
<template>
  <div>
    <h1 class="base-heading">Edit profile</h1>
    <div v-if="isLoading" class="flex justify-center">
      <div class="loader"></div>
    </div>
    <form @submit="editProfile" v-else class="flex flex-col">
      <div class="flex flex-col gap-y-4">
        <input type="text" v-model="editedProfile.username" class="base-input w-1/2" placeholder="Username" />
        <input type="text" v-model="editedProfile.specification" class="base-input w-1/2" placeholder="Specification" />
      </div>
      <h2 class="mt-8 mb-2 text-lg">Profile image</h2>
      <UploadFileContainer
        @file-selected="file => (editedProfile.image = file ? file : null)"
        class="w-1/3"
        id="image"
        max-file-size="25MB"
        accept="image/*"
      >
        <template #icon>
          <ImageIcon class="w-[48px]" />
        </template>
      </UploadFileContainer>
      <div class="w-1/2 mx-auto mt-8">
        <BaseButton :is-loading="wrapEditProfile.isLoading.value" class="w-full">Edit</BaseButton>
      </div>
    </form>
  </div>
</template>
