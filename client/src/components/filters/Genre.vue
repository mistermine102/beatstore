<script setup lang="ts">
import Filter from './Filter.vue'

const genres = ['Trap', 'R&B', 'Drill', 'Rage', 'Boom bap']
</script>

<template>
  <Filter btnCaption="Genre" popoverTitle="Genre">
    <div class="flex flex-col max-h-[150px] overflow-y-scroll">
      <div v-for="genre of genres" :key="genre" class="base-checkbox">
        <input type="checkbox" :name="genre" :id="genre" />
        <label :for="genre" class="p-2 text-nowrap">{{ genre }}</label>
      </div>
    </div>
  </Filter>
</template>

