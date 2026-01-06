<script setup lang="ts">
import useFeaturedProfiles from '../../composables/useFeaturedProfiles'
import ClickableTrackImage from '../common/ClickableTrackImage.vue'
import SectionHeading from '../common/SectionHeading.vue'
import BaseBadge from '../base/BaseBadge.vue'

const { featuredProfiles, isLoadingFeaturedProfiles, getFeaturedProfiles } = useFeaturedProfiles()

getFeaturedProfiles()

const formatPrice = (price?: number) => {
  return price ? `$${price.toFixed(2)}` : '$29.99'
}
</script>

<template>
  <section class="py-20 border-b border-midGrey w-full">
    <div class="max-w-[1300px] mx-auto px-6 md:px-8">
      <!-- Section Header -->
      <SectionHeading title="AMPLIFIED" subtitle="Promoted beats and featured releases." />

      <!-- Loading State -->
      <div v-if="isLoadingFeaturedProfiles" class="flex justify-center items-center h-[400px] w-full">
        <div class="loader"></div>
      </div>

      <!-- Content Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="featured in featuredProfiles"
          :key="featured.track._id"
          class="group relative bg-grey border border-midGrey rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-darkPrimary hover:shadow-xl flex flex-col"
        >
          <!-- Badge -->
          <!-- Badge -->
          <BaseBadge class="absolute top-3 left-3 z-20 pointer-events-none"> FEATURED </BaseBadge>

          <!-- Image Area using ClickableTrackImage -->
          <div class="w-full aspect-square">
            <ClickableTrackImage :track="featured.track" class="w-full h-full !rounded-none" />
          </div>

          <!-- Card Content -->
          <div class="p-5 flex flex-col flex-grow">
            <router-link :to="`/track/${featured.track._id}`" class="block group/text">
              <div class="font-secondary text-[24px] text-white mb-1 truncate group-hover/text:text-primary transition-colors">
                {{ featured.track.title }}
              </div>
            </router-link>

            <router-link :to="`/profile/${featured.profile._id}`" class="block group/author">
              <div class="text-textLightGrey mb-4 group-hover/author:text-white transition-colors">Prod. {{ featured.profile.username }}</div>
            </router-link>
            <div class="mt-auto flex justify-between items-center border-t border-midGrey pt-4">
              <span class="font-mono bg-[#222] text-[#888] px-2 py-1 rounded border border-[#333]"> {{ featured.track.bpm || 'N/A' }} BPM </span>
              <div class="text-primary font-bold text-xl tracking-wider">
                <!-- TODO: Add a "loweset price" field on backend and put it here -->
                {{ formatPrice(29.99) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
