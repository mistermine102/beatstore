<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
    filters: Component[]
}

defineProps<Props>()
</script>

<template>
  <div class="bg-grey p-8 mb-8 flex flex-col divide-y divide-textLightGrey w-full justify-around rounded-regular shadow-lg">
    <div v-for="(filter, index) of filters" :key="index" class="py-4">
      <component :is="filter"></component>
    </div>
  </div>
</template>

