<script setup lang="ts">
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { ref } from 'vue'
import EmptyState from './EmptyState.vue'
import BaseButton from './base/BaseButton.vue'

//profiles
const profiles = ref<Profile[]>([])
const isMore = ref(false)

const wrapGetProfiles = useAsyncWrap()
function getProfiles() {
  wrapGetProfiles.run(async () => {
    const response = await appApi.get<{ profiles: Profile[]; isMore: boolean }>('/profile?followed=true')
    profiles.value = response.data.profiles
    isMore.value = response.data.isMore
  })
}

const wrapLoadMoreProfiles = useAsyncWrap()
function loadMoreProfiles() {
  wrapLoadMoreProfiles.run(async () => {
    const response = await appApi.get<{ profiles: Profile[]; isMore: boolean }>(`/profile?start=${profiles.value.length}?followed=true`)
    profiles.value = profiles.value.concat(response.data.profiles)
    isMore.value = response.data.isMore
  })
}

getProfiles()
</script>
<template>
  <div v-if="wrapGetProfiles.isLoading.value" class="flex justify-center">
    <div class="loader"></div>
  </div>
  <EmptyState v-else-if="!profiles.length" />
  <div v-else>
    <div class="grid grid-cols-2">
      <div v-for="profile in profiles">
        <div class="flex gap-x-4">
          <img :src="profile.image.url" class="image-thumbnail rounded-regular" alt="Profile image" />
          <div>
            <router-link :to="`profile/${profile._id}`">
              <h2 class="whitespace-nowrap text-xl">{{ profile.username }}</h2>
            </router-link>
            <p><span class="text-textLightGrey">Specification</span> {{ profile.specification || 'None' }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2 mx-auto">
      <BaseButton @click="loadMoreProfiles" :is-loading="wrapLoadMoreProfiles.isLoading.value" v-if="isMore" alt class="w-full">Load more</BaseButton>
    </div>
  </div>
</template>
