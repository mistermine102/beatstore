<script setup lang="ts">
import { onMounted, ref, type Component } from 'vue'
import FrontpageHero from '../components/FrontpageHero.vue'
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
import TracksContainer from '../components/TracksContainer.vue'
import FiltersList from '../components/filters/FiltersList.vue'
import { BpmFilter, KeyFilter, GenreFilter, PopularityFilter } from '../components/filters/Filters.vine'
import appApi from '../api/appApi'
import useAsyncWrap from '../hooks/useAsyncWrap'

const wrapGetTracks = useAsyncWrap()

const filters: Component[] = [BpmFilter, GenreFilter, KeyFilter, PopularityFilter]
const tracks = ref<Track[]>([])

function getTracks() {
  wrapGetTracks.run(async () => {
    const response = await appApi.get('/beats')
    console.log(response)
  })
}

onMounted(() => {
  getTracks()
})
</script>
<template>
  <div class="h-full">
    <FrontpageHero />
    <BaseSearchbar />
    <div class="flex gap-8 mt-16">
      <div class="w-1/5">
        <FiltersList :filters="filters" />
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
