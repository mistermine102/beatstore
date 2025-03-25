<script setup lang="ts">
import BaseButton from './base/BaseButton.vue'
import useFeaturedProfiles from '../composables/useFeaturedProfiles'
import { useRouter } from 'vue-router'
import PlayPauseBtn from './PlayPauseBtn.vue'
import ClickableTrackImage from './ClickableTrackImage.vue'

const router = useRouter()

const { featuredProfiles, isLoadingFeaturedProfiles, getFeaturedProfiles } = useFeaturedProfiles()
getFeaturedProfiles()
</script>

<template>
  <div class="mt-48">
    <h2 class="text-[40px] mb-4 font-secondary">Explore</h2>
    <div class="bg-darkGrey w-full shadow-xl p-8 xl:h-[500px]">
      <div v-if="isLoadingFeaturedProfiles" class="flex justify-center items-center h-full w-full">
        <div class="loader"></div>
      </div>
      <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-x-16 h-full">
        <div v-for="featured in featuredProfiles" class="flex flex-col h-full">
          <!-- Image container with percentage-based height -->
          <ClickableTrackImage :track="featured.track" class="xl:w-full h-full xl:h-[75%]" />

          <!-- Content below image with fixed height -->
          <div class="flex justify-between gap-x-2 items-center mt-2 xl:h-[25%]">
            <div class="overflow-hidden">
              <router-link :to="`/track/${featured.track._id}`" class="text-2xl truncate">{{ featured.track.title }}</router-link>
              <p class="text-textLightGrey truncate">{{ featured.profile.username }}</p>
            </div>
            <BaseButton @click="router.push(`/profile/${featured.profile._id}`)">See more</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
