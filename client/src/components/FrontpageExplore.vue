<script setup lang="ts">
import BaseButton from './base/BaseButton.vue'
import useFeaturedProfiles from '../composables/useFeaturedProfiles'
import { useRouter } from 'vue-router'
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
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 md:gap-x-16 h-full">
        <div v-for="featured in featuredProfiles" class="flex flex-col h-full">
          <ClickableTrackImage :track="featured.track" class="w-full h-[200px] xl:h-[75%]" />
          <div class="flex flex-col xl:flex-row justify-between gap-x-2 xl:items-center mt-2 xl:h-[25%]">
            <div class="overflow-hidden">
              <router-link :to="`/track/${featured.track._id}`" class="text-2xl truncate">{{ featured.track.title }}</router-link>
              <p class="text-textLightGrey truncate">{{ featured.profile.username }}</p>
            </div>
            <BaseButton @click="router.push(`/profile/${featured.profile._id}`)" class="mt-4 xl:mt-0 w-full xl:w-auto">See more</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
