<script setup lang="ts">
import FrontpageHero from '../components/FrontpageHero.vue'
import FrontpageExplore from '../components/FrontpageExplore.vue'
import FrontpageTracktypes from '../components/FrontpageTracktypes.vue'
import { ref } from 'vue'
import appApi from '../api/appApi'
import ClickableTrackImage from '../components/ClickableTrackImage.vue'
import { PlayIcon } from '../components/icons/index.vine'

const popularTracks = ref<PopularTrack[]>([])

async function getPopularTracks() {
  const response = await appApi.get('/tracks/popular')
  popularTracks.value = response.data.tracks
}

getPopularTracks()
</script>

<template>
  <div class="h-full">
    <FrontpageHero />
    <FrontpageExplore class="relative" />
    <div class="mt-48">
      <h2 class="text-[40px] mb-8 font-secondary">Popular right now</h2>
      <div class="flex gap-x-16">
        <div v-for="track in popularTracks">
          <ClickableTrackImage :track="track" class="w-[200px] h-[200px]" />
          <div class="flex justify-between items-center mt-2">
            <div class="max-w-40">
              <router-link :to="`/tracks/${track._id}`" class="text-xl truncate">{{ track.title }}</router-link>
              <p class="text-textLightGrey truncate">{{ track.author.username }}</p>
            </div>
            <div class="flex gap-x-2 items-center">
              <PlayIcon class="text-iconLightGrey" :size="20" />
              <p class="text-sm">{{ track.totalStreams }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FrontpageTracktypes />
  </div>
</template>
