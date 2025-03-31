<script setup lang="ts">
import FrontpageHero from '../components/FrontpageHero.vue'
import FrontpageExplore from '../components/FrontpageExplore.vue'
import FrontpageTracktypes from '../components/FrontpageTracktypes.vue'
import FrontpagePopularTracks from '../components/FrontpagePopularTracks.vue'
</script>

<template>
  <div class="h-full">
    <FrontpageHero />
    <FrontpageExplore class="relative" />
    <FrontpagePopularTracks />
    <FrontpageTracktypes />
  </div>
</template>
<style>
.custom-scrollbar {
  ::-webkit-scrollbar {
    background: transparent;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent;
  }
}
</style>
