<script setup lang="ts">
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import { TrashIcon } from './icons/index.vine'
import { useAuthStore } from '../stores/auth'
import LikeButton from './LikeButton.vue'
import LoginPromptModal from './LoginPromptModal.vue'
import { ref } from 'vue'

const props = defineProps<{ comment: TrackComment; track: Track }>()
const emit = defineEmits(['toggleLike', 'deleteComment'])

const authStore = useAuthStore()
const showLoginPrompt = ref(false)

const wrapChangeVote = useAsyncWrap()

function handleLikeClick() {
  if (!authStore.user) {
    showLoginPrompt.value = true
    return
  }

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
      <img :src="comment.author.image.url" alt="" class="image-small rounded-regular" />
      <div>
        <router-link :to="`/profile/${comment.author._id}`" class="text-textLightGrey">{{ comment.author.username }}</router-link>
        <p class="mb-2">{{ comment.content }}</p>
        <div class="flex h-fit gap-x-2">
          <LikeButton 
            :likes="comment.totalLikes" 
            :is-liked="comment.isLiked"
            @click="handleLikeClick"
          />
        </div>
      </div>
    </div>
    <div v-if="comment.author._id === authStore.user?._id" class="opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click="deleteComment" class="text-red-500">
        <TrashIcon />
      </button>
    </div>
  </div>

  <LoginPromptModal 
    :is-open="showLoginPrompt"
    message="Log in to like the comments"
    @close="showLoginPrompt = false"
  />
</template>
