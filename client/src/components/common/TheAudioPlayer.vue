<script setup lang="ts">
import TrackInformation from '../audio-player/TrackInformation.vue'
import DurationControls from '../audio-player/DurationControls.vue'
import VolumeControls from '../audio-player/VolumeControls.vue'
</script>
<template>
  <div class="grid grid-cols-6 lg:grid-cols-4 fixed bottom-0 w-full h-[100px] bg-darkGrey items-center z-20">
    <TrackInformation />
    <DurationControls class="col-span-4 lg:col-span-2" />
    <VolumeControls />
  </div>
</template>
