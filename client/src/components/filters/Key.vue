<script setup lang="ts">
import Filter from './Filter.vue'

const keys = [
  'A Minor',
  'A# Minor',
  'B Minor',
  'C Minor',
  'C# Minor',
  'D Minor',
  'D# Minor',
  'E Minor',
  'F Minor',
  'F# Minor',
  'G Minor',
  'G# Minor',
  'A Major',
  'A# Major',
  'B Major',
  'C Major',
  'C# Major',
  'D Major',
  'D# Major',
  'E Major',
  'F Major',
  'F# Major',
  'G Major',
  'G# Major',
]
</script>

<template>
  <Filter btnCaption="Key" popoverTitle="Key">
    <div class="flex flex-col max-h-[150px] overflow-y-scroll">
      <div v-for="key of keys" :key="key" class="base-checkbox">
        <input type="checkbox" :name="key" :id="key" />
        <label :for="key" class="p-2 text-nowrap">{{ key }}</label>
      </div>
    </div>
  </Filter>
</template>
