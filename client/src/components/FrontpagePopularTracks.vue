<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons/index.vine'
import ClickableTrackImage from './ClickableTrackImage.vue'
import appApi from '../api/appApi'
import type { Swiper, SwiperOptions } from 'swiper/types'
import BaseButton from './base/BaseButton.vue'

const popularTracks = ref<PopularTrack[]>([])

const swiperOptions: SwiperOptions = {
  breakpoints: {
    640: {
      slidesPerView: 3,
      spaceBetween: 32
    },
    1280: {
      slidesPerView: 4,
    },
  },
}

const swiperRef = useTemplateRef('tracks-swiper')

function handleSwiperNavigation(direction: 'prev' | 'next') {
  if (!swiperRef.value) return
  const swiper = (swiperRef.value as any).swiper as Swiper
  direction === 'prev' ? swiper.slidePrev() : swiper.slideNext()
}

const hasPrevSlide = ref(false)
const hasNextSlide = ref(true)

async function getPopularTracks() {
  const response = await appApi.get('/tracks/popular')
  popularTracks.value = response.data.tracks
}

getPopularTracks()

onMounted(() => {
  const swiper = (swiperRef.value as any).swiper as Swiper

  swiper.on('slideChange', s => {
    hasNextSlide.value = !s.isEnd
    hasPrevSlide.value = !s.isBeginning
  })
})
</script>

<template>
  <div class="mt-12 sm:mt-48">
    <h2 class="text-[40px] mb-8 font-secondary">Popular right now</h2>
    <div class="relative px-12 sm:px-16">
      <swiper-container ref="tracks-swiper" :slides-per-view="2" :space-between="16" :breakpoints="swiperOptions.breakpoints">
        <swiper-slide v-for="track in popularTracks" :key="track._id" class="w-[150px] md:w-[200px]">
          <div>
            <ClickableTrackImage :track="track" class="w-full h-[150px] md:h-[200px]" />
            <div class="flex justify-between items-center mt-2">
              <div class="max-w-24 sm:max-w-40 truncate">
                <router-link :to="`/track/${track._id}`" class="text-xl">
                  {{ track.title }}
                </router-link>
                <p class="text-textLightGrey">
                  {{ track.author.username }}
                </p>
              </div>
              <div class="flex gap-x-2 items-center">
                <PlayIcon class="text-iconLightGrey" :size="20" />
                <p class="text-sm">{{ track.totalStreams }}</p>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
      <div class="absolute inset-0 z-[5] pointer-events-none flex items-center justify-between">
        <BaseButton @click="handleSwiperNavigation('prev')" :disabled="!hasPrevSlide" alt class="pointer-events-auto !px-1">
          <ChevronLeftIcon :size="32" class="text-white" />
        </BaseButton>
        <BaseButton @click="handleSwiperNavigation('next')" :disabled="!hasNextSlide" alt class="pointer-events-auto !px-1">
          <ChevronRightIcon :size="32" class="text-white" />
        </BaseButton>
      </div>
    </div>
  </div>
</template>
