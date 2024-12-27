<script setup lang="ts">
import { onMounted, ref, type Component } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'

import Filters from '../components/filters/Filters.vue'
import BpmFilter from '../components/filters/Bpm.vue'
import GenreFilter from '../components/filters/Genre.vue'
import KeyFilter from '../components/filters/Key.vue'
import PopularityFilter from '../components/filters/Popularity.vue'

const filters: Component[] = [BpmFilter, GenreFilter, KeyFilter, PopularityFilter]

const tracks = ref<Track[]>([])

onMounted(() => {
  //get the tracks
})
</script>
<template>
  <div class="h-full">
    <FrontpageHero />
    <BaseSearchbar />
    <div class="flex gap-8 mt-16">
      <div class="w-1/5">
        <Filters :filters="filters" />
      </div>
      <div class="w-4/5">
        <div class="grid grid-cols-3 gap-4 mb-4">
          <button class="base-btn">Beats</button>
          <button class="base-btn-alt">Samples</button>
          <button class="base-btn-alt">Drum Kits</button>
        </div>
        <TracksContainer :tracks="tracks" :isLoading="false" />
      </div>
    </div>
  </div>
</template>
