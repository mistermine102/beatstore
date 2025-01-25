<script setup lang="ts">
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import { HeartIcon, TrashIcon } from './icons/index.vine'
import { useAuthStore } from '../stores/auth'

const props = defineProps<{ comment: TrackComment; track: Track }>()
const emit = defineEmits(['toggleLike', 'deleteComment'])

const authStore = useAuthStore()

const wrapChangeVote = useAsyncWrap()

function toggleLike() {
  wrapChangeVote.run(async () => {
    await appApi.patch(`/tracks/${props.track._id}/comment/${props.comment._id}`)
  })
  emit('toggleLike')
}

const wrapDeleteComment = useAsyncWrap()

function deleteComment() {
  wrapDeleteComment.run(async () => {
    await appApi.delete(`/tracks/${props.track._id}/comment/${props.comment._id}`)
    emit('deleteComment')
  })
}
</script>

<template>
  <div class="flex justify-between group">
    <div class="flex gap-x-4">
      <img :src="comment.author.image.url" alt="" class="image-small" />
      <div>
        <p class="text-textLightGrey">{{ comment.author.username }}</p>
        <p class="mb-2">{{ comment.content }}</p>
        <div class="flex h-fit gap-x-2">
          <button @click="toggleLike">
            <HeartIcon :class="comment.isLiked ? 'text-primary' : 'text-textLightGrey'" />
          </button>
          <p class="text-center">{{ comment.totalLikes }}</p>
        </div>
      </div>
    </div>
    <div v-if="comment.author._id === authStore.user?._id" class="opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click="deleteComment">
        <TrashIcon class="text-red-500" />
      </button>
    </div>
  </div>
</template>
