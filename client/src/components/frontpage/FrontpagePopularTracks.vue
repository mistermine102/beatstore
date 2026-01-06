<script setup lang="ts">
import { ref } from 'vue'
import ClickableTrackImage from '../common/ClickableTrackImage.vue'
import SectionHeading from '../common/SectionHeading.vue'
import appApi from '../../api/appApi'

const popularTracks = ref<PopularTrack[]>([])
const isLoading = ref(true)

async function getPopularTracks() {
  try {
    isLoading.value = true
    const response = await appApi.get('/tracks/popular')
    // Slice to get only top 5 for the list view
    popularTracks.value = response.data.tracks.slice(0, 5)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

// Helper to pad index (0 -> 01, 1 -> 02)
const formatIndex = (i: number) => {
  return (i + 1).toString().padStart(2, '0')
}

// Helper to construct "tags" from available metadata
const getTrackTags = (track: PopularTrack) => {
  const tags: string[] = []

  // Add Genre
  if (track.genre) tags.push(track.genre)

  // Add Mood
  if (track.mood) tags.push(track.mood)

  // Fallback or extra info if we don't have enough tags
  if (tags.length < 2 && track.type) {
    // Capitalize type (beat -> Beat)
    tags.push(track.type.charAt(0).toUpperCase() + track.type.slice(1))
  }

  // Slice to max 2 tags for display
  return tags.slice(0, 2)
}

getPopularTracks()
</script>

<template>
  <section class="py-20 w-full border-b border-midGrey">
    <div class="max-w-[1300px] mx-auto px-6 md:px-8">
      <SectionHeading title="TRENDING NOW" subtitle="Top 5 beats this week." />
      <div v-if="isLoading" class="flex justify-center items-center h-[300px]">
        <div class="loader"></div>
      </div>
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="(track, index) in popularTracks"
          :key="track._id"
          class="group flex items-center p-3 sm:p-4 rounded-xl border border-transparent hover:bg-grey hover:border-midGrey transition-all duration-200 cursor-default"
        >
          <!-- 1. Index (01, 02...) -->
          <div class="font-secondary text-3xl text-midGrey w-12 sm:w-16 text-center group-hover:text-primary transition-colors duration-200">
            {{ formatIndex(index) }}
          </div>

          <!-- 2. Thumbnail (Playable) -->
          <div class="w-[80px] h-[80px] rounded-lg overflow-hidden mx-4 sm:mx-6 flex-shrink-0 bg-black">
            <ClickableTrackImage :track="track" class="w-full h-full object-cover" />
          </div>

          <!-- 3. Track Details -->
          <div class="flex-1 min-w-0 mr-4">
            <router-link :to="`/track/${track._id}`" class="block">
              <h3 class="font-semibold text-white text-xl truncate hover:text-primary transition-colors">
                {{ track.title }}
              </h3>
            </router-link>
            <router-link :to="`/profile/${track.author._id}`" class="block">
              <span class="text-textLightGrey hover:text-white transition-colors"> Prod. {{ track.author.username }} </span>
            </router-link>
          </div>

          <!-- 4. Tags (Constructed from metadata, Hidden on Mobile) -->
          <div class="hidden md:flex gap-3 mr-8">
            <span v-for="tag in getTrackTags(track)" :key="tag" class="bg-[#222] text-[#888] px-3 py-1 rounded-md">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
