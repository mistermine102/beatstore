<script setup lang="ts">
import appApi from '../../api/appApi'
import useAsyncWrap from '../../composables/useAsyncWrap'
import BasePopover from '../base/BasePopover.vue'
import { MoreVertical } from '../icons/index.vine'
import { useRouter } from 'vue-router'

const { track } = defineProps<{ track: Track }>()

const router = useRouter()

const wrapDeleteTrack = useAsyncWrap()

function deleteTrack() {
  let trackUrl: string

  switch (track.type) {
    case 'beat':
      trackUrl = '/beats'
      break
    case 'sample':
      trackUrl = '/samples'
      break
    case 'drumkit':
      trackUrl = '/drumkits'
      break
  }

  wrapDeleteTrack.run(async () => {
    if (!track) return

    await appApi.delete(`${trackUrl}`, {
      data: {
        trackId: track._id,
      },
    })
    router.push('/')
  })
}
</script>

<template>
  <BasePopover>
    <template #popover-button>
      <MoreVertical />
    </template>
    <template #popover-content>
      <button @click="deleteTrack" class="text-red-500">Delete</button>
    </template>
  </BasePopover>
</template>
