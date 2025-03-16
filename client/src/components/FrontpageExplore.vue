<script setup lang="ts">
import BaseButton from './base/BaseButton.vue'
import useFeaturedProfiles from '../composables/useFeaturedProfiles'
import { useRouter } from 'vue-router'
import PlayPauseBtn from './PlayPauseBtn.vue'

const router = useRouter()

const { featuredProfiles, isLoadingFeaturedProfiles, getFeaturedProfiles } = useFeaturedProfiles()
getFeaturedProfiles()
</script>

<template>
  <div class="mt-48">
    <h2 class="text-[40px] mb-4 font-secondary">Explore</h2>
    <div class="bg-darkGrey w-full shadow-xl p-8 h-[400px]">
      <div v-if="isLoadingFeaturedProfiles" class="flex justify-center items-center h-full w-full">
        <div class="loader"></div>
      </div>
      <div v-else class="grid grid-cols-3 gap-x-16 h-full">
        <div v-for="featured in featuredProfiles" class="flex flex-col h-full">
          <!-- Image container with percentage-based height -->
          <div class="w-full h-[75%] relative rounded-regular group">
            <PlayPauseBtn :track="featured.track" class="absolute z-[3] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div class="w-full h-full bg-black/5 absolute z-[2] rounded-regular group-hover:bg-black/50 transition-colors"></div>
            <img :src="featured.track.image.url" alt="" class="absolute h-full w-full object-cover z-[1] rounded-regular" />
          </div>

          <!-- Content below image with fixed height -->
          <div class="flex justify-between gap-x-2 items-center mt-2 h-[25%]">
            <div class="overflow-hidden">
              <router-link :to="`/track/${featured.track._id}`" class="text-2xl truncate">{{ featured.track.title }}</router-link>
              <p class="text-textLightGrey truncate">{{ featured.profile.username }}</p>
            </div>
            <BaseButton @click="router.push(`/profile/${featured.profile._id}`)" class="">See more</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
