<script setup lang="ts">
import BaseButton from '../base/BaseButton.vue'
import TrackComment from '../TrackComment.vue'
import { ref } from 'vue'
import useAsyncWrap from '../../composables/useAsyncWrap'
import appApi from '../../api/appApi'

const props = defineProps<{ comments: TrackComment[]; track: Track }>()
const emit = defineEmits(['changeComments', 'toggleLike'])

const newComment = ref('')

const wrapAddComment = useAsyncWrap()

function addComment() {
  if (!newComment.value) return

  wrapAddComment.run(async () => {
    await appApi.post(`/tracks/${props.track._id}/comment`, {
      content: newComment.value,
    })
    emit('changeComments')
  })
}
</script>

<template>
  <div>
    <h2 class="base-heading">Comments</h2>
    <div class="w-full">
      <div class="flex gap-x-4 mb-8">
        <textarea v-model="newComment" class="base-input w-full" rows="1" name="" id="" placeholder="Leave a comment">{{ newComment }}</textarea>
        <BaseButton :disabled="!newComment" @click="addComment" :is-loading="wrapAddComment.isLoading.value">Send</BaseButton>
      </div>
      <div class="flex flex-col gap-y-8">
        <TrackComment
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :track="track"
          @toggle-like="emit('toggleLike', comment._id)"
          @delete-comment="emit('changeComments')"
        />
      </div>
    </div>
  </div>
</template>
