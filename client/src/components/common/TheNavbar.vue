<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import ProfilePopover from '../profile/ProfilePopover.vue'
import { HeartIcon, ListIcon, SearchIcon, UploadIcon } from '../icons/index.vine'
import BaseButton from '../base/BaseButton.vue'
import BasePopover from '../base/BasePopover.vue'

defineProps<{
  // Accept the class string from parent
  contentClass?: string
}>()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>

<template>
  <header class="fixed z-30 top-0 right-0 left-0 bg-darkGrey shadow-xl">
    <div class="w-full max-w-[1400px] mx-auto px-8">
      <nav class="py-4 flex items-center justify-between">
        <div class="flex gap-x-16 lg:gap-x-32 items-center">
          <div class="flex justify-start">
            <router-link to="/" class="text-[18px] text-primary font-secondary">WavsMarket</router-link>
          </div>
          <div class="items-center hidden sm:flex gap-x-8 lg:gap-x-16">
            <router-link to="/tracks/browse" class="flex items-center gap-x-2 text-iconLightGrey hover:text-white transition-colors">
              <SearchIcon />
              <span>Browse</span>
            </router-link>
            <router-link to="/upload" class="flex items-center gap-x-2 text-iconLightGrey hover:text-white transition-colors">
              <UploadIcon />
              <span>Upload</span>
            </router-link>
          </div>
        </div>
        <div v-if="authStore.isLoading" class="scale-50">
          <div class="loader"></div>
        </div>
        <div v-else class="flex items-center gap-x-8 md:gap-x-16">
          <router-link v-if="user" to="/liked" class="clickable-icon">
            <HeartIcon />
          </router-link>
          <div v-if="user" class="flex gap-x-2">
            <p class="hidden md:block">
              Welcome <span class="text-primary">{{ user.username }}</span>
            </p>
            <ProfilePopover />
          </div>
          <BaseButton v-if="!user" @click="$router.push('/signin')">Sign in</BaseButton>
          <BasePopover class="block sm:hidden">
            <template #popover-button>
              <ListIcon class="clickable-icon" />
            </template>
            <template #popover-content>
              <div class="flex flex-col divide-y-2 divide-lightGray">
                <router-link to="/upload" class="whitespace-nowrap py-2">Upload</router-link>
                <router-link to="/tracks/browse" class="whitespace-nowrap py-2">Browse</router-link>
              </div>
            </template>
          </BasePopover>
        </div>
      </nav>
    </div>
  </header>
</template>
