<!-- <script setup lang="ts">
import { watch } from 'vue'
import TracksContainer from '../components/TracksContainer.vue'
import useTracks from '../composables/useTracks'
import { useRoute } from 'vue-router'

const route = useRoute()
const { phrase } = route.params as {
  phrase: string
}

const { tracks, getTracks, isLoading, loadMoreTracks, isLoadingMore, isMore } = useTracks()
getTracks('all', { filters: { phrase } })

watch(
  () => route.params.phrase as string,
  val => {
    console.log(123)
    getTracks('all', { filters: { phrase: val } })
  }
)
</script>
<template>
  <div>
    <h1 class="base-heading">Search results</h1>
    <TracksContainer
      :tracks="tracks"
      :is-loading="isLoading"
      :is-loading-more="isLoadingMore"
      :is-more="isMore"
      @loaded-more="loadMoreTracks('all', { filters: { phrase } })"
    />
  </div>
</template> -->
