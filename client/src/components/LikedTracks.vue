<script setup lang="ts">
import useTracks from '../composables/useTracks'
import TracksContainer from '../components/TracksContainer.vue'

const { tracks, getTracks, isLoading, loadMoreTracks, isMore, isLoadingMore, toggleLike } = useTracks()

getTracks('all', { filters: { liked: true } })
</script>
<template>
  <TracksContainer
    :tracks="tracks"
    :is-loading="isLoading"
    :is-more="isMore"
    :is-loading-more="isLoadingMore"
    @like-toggled="toggleLike"
    @loaded-more="loadMoreTracks('all', { filters: { liked: true } })"
  />
</template>
