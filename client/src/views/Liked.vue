<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import useTracks from '../composables/useTracks'
import TracksContainer from '../components/TracksContainer.vue'

const selectedTab = ref('uploads')
const { tracks, getTracks, isLoading, loadMoreTracks, isMore, isLoadingMore } = useTracks()

getTracks('all', { filters: { liked: true } })

watch(selectedTab, () => {
  switch (selectedTab.value) {
    case 'uploads':
      getTracks('all', { filters: { liked: true } })
      break
    case 'profiles':
      break
  }
})
</script>
<template>
  <div>
    <div class="flex gap-x-8 mb-16">
      <BaseButton @click="selectedTab = 'uploads'" :alt="selectedTab !== 'uploads'">Liked uploads</BaseButton>
      <BaseButton @click="selectedTab = 'profiles'" :alt="selectedTab !== 'profiles'">Followed profiles</BaseButton>
    </div>
    <TracksContainer
      :tracks="tracks"
      :is-loading="isLoading"
      :is-more="isMore"
      :is-loading-more="isLoadingMore"
      @loaded-more="loadMoreTracks('all', { filters: { liked: true } })"
    />
  </div>
</template>
