<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SearchIcon } from './icons/index.vine'
import { GENRES, KEYS, INSTRUMENTS, MOODS } from '../constants'
import BaseButton from './base/BaseButton.vue'

const router = useRouter()

function navigateToBrowse(paramName: string, paramValue: string) {
  router.push({
    path: '/tracks/browse',
    query: {
      [paramName]: paramValue,
    },
  })
}
</script>

<template>
  <div class="mt-48">
    <h2 class="text-[40px] mb-8 font-secondary">Find what you need</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h3 class="text-2xl mb-4 font-semibold">Genres</h3>
        <div class="flex flex-wrap gap-3">
          <BaseButton @click="navigateToBrowse('genre', genre)" v-for="genre in GENRES.slice(0, 12)" :key="genre" alt>
            <div class="flex gap-x-2 items-center">
              <span>{{ genre }}</span>
              <SearchIcon :size="16" />
            </div>
          </BaseButton>
        </div>
      </div>
      <div>
        <h3 class="text-2xl mb-4 font-semibold">Keys</h3>
        <div class="flex flex-wrap gap-3">
          <BaseButton @click="navigateToBrowse('key', key)" v-for="key in KEYS.slice(0, 12)" :key="key" alt>
            <div class="flex gap-x-2 items-center">
              <span>{{ key }}</span>
              <SearchIcon :size="16" />
            </div>
          </BaseButton>
        </div>
      </div>
      <div>
        <h3 class="text-2xl mb-4 font-semibold">Instruments</h3>
        <div class="flex flex-wrap gap-3">
          <BaseButton @click="navigateToBrowse('instruments', instrument)" v-for="instrument in INSTRUMENTS.slice(0, 12)" :key="instrument" alt>
            <div class="flex gap-x-2 items-center">
              <span>{{ instrument }}</span>
              <SearchIcon :size="16" />
            </div>
          </BaseButton>
        </div>
      </div>
      <div>
        <h3 class="text-2xl mb-4 font-semibold">Moods</h3>
        <div class="flex flex-wrap gap-3">
          <BaseButton @click="navigateToBrowse('mood', mood)" v-for="mood in MOODS.slice(0, 12)" :key="mood" alt>
            <div class="flex gap-x-2 items-center">
              <span>{{ mood }}</span>
              <SearchIcon :size="16" />
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
