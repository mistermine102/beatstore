<script setup lang="ts">
import FrontpageHero from '../components/FrontpageHero.vue'
import FrontpageExplore from '../components/FrontpageExplore.vue'
import FrontpageTracktypes from '../components/FrontpageTracktypes.vue'
</script>

<template>
  <div class="h-full">
    <FrontpageHero />
    <FrontpageExplore class="relative" />
    <div class="mt-48">
      <h2 class="text-[40px] mb-8 font-secondary">Popular right now</h2>
      <div class="flex gap-x-8">
        <div class="p-4">
          <img src="" alt="" class="w-[200px] h-[200px]" />
          <div>
            <h3 class="text-2xl">Beat 1</h3>
            <p>Author</p>
          </div>
        </div>
        <div class="p-4">
          <img src="" alt="" class="w-[200px] h-[200px]" />
          <div>
            <h3 class="text-2xl">Beat 1</h3>
            <p>Author</p>
          </div>
        </div>
        <div class="p-4">
          <img src="" alt="" class="w-[200px] h-[200px]" />
          <div>
            <h3 class="text-2xl">Beat 1</h3>
            <p>Author</p>
          </div>
        </div>
        <div class="p-4">
          <img src="" alt="" class="w-[200px] h-[200px]" />
          <div>
            <h3 class="text-2xl">Beat 1</h3>
            <p>Author</p>
          </div>
        </div>
        <div class="p-4">
          <img src="" alt="" class="w-[200px] h-[200px]" />
          <div>
            <h3 class="text-2xl">Beat 1</h3>
            <p>Author</p>
          </div>
        </div>
      </div>
    </div>
    <FrontpageTracktypes />
  </div>
</template>
