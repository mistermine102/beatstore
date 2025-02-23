<script setup lang="ts">
import BaseSearchbar from '../components/base/BaseSearchbar.vue'
</script>

<template>
  <div>
    <div class="flex gap-x-8">
      <select class="base-input">
        <option value="">Beats</option>
        <option value="">Samples</option>
        <option value="">Loops</option>
      </select>
      <BaseSearchbar placeholder="Search" class="flex-1" />
    </div>
  </div>
</template>
