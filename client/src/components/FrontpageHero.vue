<script setup lang="ts">
import { ref } from 'vue'
import BaseSearchbar from './base/BaseSearchbar.vue'
import { useRouter } from 'vue-router'
import { SearchIcon } from './icons/index.vine'

const router = useRouter()

const searchPhrase = ref('')
</script>

<template>
  <div class="relative grid lg:grid-cols-2 gap-x-8">
    <div class="flex flex-col justify-center relative">
      <h1 class="flex flex-col leading-tight">
        <span class="font-secondary text-[40px] md:text-[48px]">Find high quality</span>
        <span class="font-secondary text-[48px] md:text-[56px] text-primary">Beats, Samples and more</span>
      </h1>
      <BaseSearchbar
        v-model="searchPhrase"
        @search="phrase => router.push(`/tracks/browse?q=${phrase}`)"
        placeholder="What are you looking for?"
        class="mt-8"
        container-class="md:py-2 bg-grey px-2 md:px-4"
        button-class="h-full px-8"
        :show-button="true"
      />
      <div class="flex mt-4 gap-x-4">
        <button
          @click="router.push({ path: 'tracks/browse', query: { type: 'beat' } })"
          class="bg-darkGrey px-4 py-1 flex items-center gap-x-2 rounded-regular clickable-icon"
        >
          <span>Beats</span>
          <SearchIcon :size="16" />
        </button>
        <button
          @click="router.push({ path: 'tracks/browse', query: { type: 'sample' } })"
          class="bg-darkGrey px-4 py-1 flex items-center gap-x-2 rounded-regular clickable-icon"
        >
          <span>Samples</span>
          <SearchIcon :size="16" />
        </button>
        <button
          @click="router.push({ path: 'tracks/browse', query: { type: 'loop' } })"
          class="bg-darkGrey px-4 py-1 flex items-center gap-x-2 rounded-regular clickable-icon"
        >
          <span>Loops</span>
          <SearchIcon :size="16" />
        </button>
      </div>
    </div>
    <div class="hidden lg:flex items-end justify-center w-full h-[450px] relative">
      <img src="/pixel-art-hero.png" alt="" class="w-full h-full object-contain" />
      <div class="absolute inset-0 z-0 flex justify-center items-end mb-16">
        <div class="bg-primary w-[150px] h-[200px] absolute blur-[200px]"></div>
      </div>
    </div>
  </div>
</template>
