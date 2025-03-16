<script setup lang="ts">
defineProps<{ track: Track }>()
</script>

<template>
  <div class="panel mb-8">
    <h2 class="base-heading">Details</h2>
    <div class="gap-x-16">
      <div class="flex flex-col divide-y divide-textLightGrey items-center">
        <p v-if="track.bpm !== undefined" class="flex justify-between w-full py-4 px-8">
          <span class="text-textLightGrey">Bpm</span> <span>{{ track.bpm || 'Unknown' }}</span>
        </p>
        <p v-if="track.key !== undefined" class="flex justify-between w-full py-4 px-8">
          <span class="text-textLightGrey">Key</span> <span>{{ track.key || 'Unknown' }}</span>
        </p>
        <p v-if="track.genre !== undefined" class="flex justify-between w-full py-4 px-8">
          <span class="text-textLightGrey">Genre</span> <span>{{ track.genre || 'Unknown' }}</span>
        </p>
        <p v-if="track.instruments !== undefined" class="flex justify-between w-full py-4 px-8">
          <span class="text-textLightGrey">Instruments</span> 
          <span v-tippy="track.instruments.join(', ')">{{ track.instruments.length ? 
              (track.instruments.slice(0, 3).join(', ') + (track.instruments.length > 3 ? ` +${track.instruments.length - 3}` : ''))
              : 'Unknown' 
          }}</span>
        </p>
        <p v-if="track.mood !== undefined" class="flex justify-between w-full py-4 px-8">
          <span class="text-textLightGrey">Mood</span> 
          <span>{{ track.mood || 'Unknown' }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
