<script setup lang="ts">
import BaseButton from '../base/BaseButton.vue'
import TrackComment from '../TrackComment.vue'
import { ref } from 'vue'
import useAsyncWrap from '../../composables/useAsyncWrap'
import appApi from '../../api/appApi'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps<{ comments: TrackComment[]; track: Track }>()
const emit = defineEmits(['changeComments', 'toggleLike'])

const authStore = useAuthStore()
const router = useRouter()
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
  <div class="panel">
    <h2 class="base-heading">Comments <span class="text-textLightGrey">{{ track.comments.length }}</span></h2>
    <div class="w-full">
      <div v-if="authStore.user" class="flex gap-x-4 mb-8">
        <textarea v-model="newComment" class="base-input w-full bg-background" rows="1" placeholder="Leave a comment">{{ newComment }}</textarea>
        <BaseButton :disabled="!newComment" @click="addComment" :is-loading="wrapAddComment.isLoading.value">Send</BaseButton>
      </div>
      <div v-else class="flex items-center justify-center gap-4 mb-8 py-6 bg-background rounded-regular">
        <span class="text-textLightGrey">Want to leave a comment?</span>
        <BaseButton @click="router.push('/login')" class="w-fit">Log in</BaseButton>
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
