<script setup lang="ts">
import TrackInformation from './audioPlayer/TrackInformation.vue'
import DurationControls from './audioPlayer/DurationControls.vue'
import VolumeControls from './audioPlayer/VolumeControls.vue'
</script>
<template>
  <div class="grid grid-cols-4 fixed bottom-0 w-full h-[100px] bg-darkGrey items-center z-20">
    <TrackInformation />
    <DurationControls class="col-span-2" />
    <VolumeControls />
  </div>
</template>
