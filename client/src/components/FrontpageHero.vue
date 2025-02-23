<script setup lang="ts">
import BaseSearchbar from './base/BaseSearchbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="relative grid grid-cols-2 gap-x-8">
    <div class="flex flex-col justify-center relative">
      <h1 class="flex flex-col leading-tight">
        <span class="font-secondary text-[48px]">Find high quality</span>
        <span class="font-secondary text-[56px] text-primary">Beats, Samples and more</span>
      </h1>
      <BaseSearchbar
        @search="phrase => router.push(`/tracks/browse?q=${phrase}`)"
        placeholder="What are you looking for?"
        class="mt-8"
        container-class="py-2 bg-grey"
        button-class="py-2"
      />
      <div class="flex mt-2 gap-x-4">
        <button class="bg-darkGrey px-4 flex items-center gap-x-2">
          <span>Beats</span>
        </button>
        <button class="bg-darkGrey px-4 flex items-center gap-x-2">
          <span>Samples</span>
        </button>
        <button class="bg-darkGrey px-4 flex items-center gap-x-2">
          <span>Loops</span>
        </button>
      </div>
    </div>
    <div class="flex items-end justify-center w-full h-[600px] relative">
      <img src="/pixel-art-hero.png" alt="" class="w-full h-full object-contain" />
      <div class="absolute inset-0 z-0 flex justify-center items-end mb-16">
        <div class="bg-primary w-[150px] h-[200px] absolute blur-[200px]"></div>
      </div>
    </div>
  </div>
</template>
