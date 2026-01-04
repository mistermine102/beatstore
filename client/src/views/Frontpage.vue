<script setup lang="ts">
import FrontpageHero from '../components/FrontpageHero.vue'
import FrontpageExplore from '../components/FrontpageExplore.vue'
import FrontpageTracktypes from '../components/FrontpageTracktypes.vue'
import FrontpagePopularTracks from '../components/FrontpagePopularTracks.vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'
import FrontpageMonetize from '../components/FrontpageMonetize.vue'
</script>

<!-- TODO: Animations on featured profiles and/or vibe cards. 
      Add an animation (every 10 seconds) of featured profiles getting switthced with new ones. 
      Old ones moving to the left and new ones appearing from the rigth.
      A quick swipe like a new deck jsut appeared.
-->

<template>
  <ScreenWrapper width="full">
    <div class="h-full">
      <FrontpageHero />
      <FrontpageExplore class="relative" />
      <FrontpageMonetize />
      <FrontpagePopularTracks />
      <FrontpageTracktypes />
    </div>
  </ScreenWrapper>
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
