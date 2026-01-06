<script setup lang="ts">
import { useRoute } from 'vue-router'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { reactive, ref } from 'vue'
import useToggleLike from '../composables/useToggleLike'
import EmptyState from '../components/EmptyState.vue'
import GeneralInfoPanel from '../components/singleTrack/GeneralInfoPanel.vue'
import DetailsPanel from '../components/singleTrack/DetailsPanel.vue'
import AuthorPanel from '../components/singleTrack/AuthorPanel.vue'
import CommentsPanel from '../components/singleTrack/CommentsPanel.vue'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import { FlagIcon } from '../components/icons/index.vine'
import BaseButton from '../components/base/BaseButton.vue'
import BaseModal from '../components/base/BaseModal.vue'
import LoginPromptModal from '../components/LoginPromptModal.vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const authStore = useAuthStore()
const toastStore = useToastStore()

const route = useRoute()
const wrapGetTrack = reactive(useAsyncWrap())

const { id: trackId } = route.params as {
  id: string
}

const track = ref<Track | null>(null)

function getTrack() {
  wrapGetTrack.run(async () => {
    const response = await appApi.get<{ track: Track }>(`tracks/single/${trackId}`)
    track.value = response.data.track
  })
}

getTrack()

function toggleCommentLike(commentId: string) {
  if (!track.value) return
  const comment = track.value.comments.find(el => el._id === commentId)!

  comment.isLiked ? comment.totalLikes-- : comment.totalLikes++
  comment.isLiked = !comment.isLiked
}

const { toggleLike } = useToggleLike()

const showReportModal = ref(false)
const showLoginPrompt = ref(false)
const reportMessage = ref('')
const wrapReport = reactive(useAsyncWrap())

async function submitReport() {
  if (!track.value || !authStore.user) return

  try {
    await wrapReport.run(async () => {
      const trackId = track.value?._id
      if (!trackId) {
        toastStore.show({
          type: 'error',
          title: 'Error',
          message: 'Could not find track ID',
        })
        return
      }

      await appApi.post('/reports', {
        trackId,
        message: reportMessage.value,
      })

      showReportModal.value = false
      reportMessage.value = ''
      toastStore.show({
        type: 'success',
        title: 'Report submitted',
        message: 'Thank you for your report. Our team will review it shortly.',
      })
    })
  } catch (error: any) {
    toastStore.show({
      type: 'error',
      title: 'Could not submit report',
      message: error.response?.data?.message || 'Please try again later',
    })
  }
}

function openReportModal() {
  if (!authStore.user) {
    showLoginPrompt.value = true
    return
  }
  showReportModal.value = true
}
</script>

<template>
  <ScreenWrapper>
    <div v-if="wrapGetTrack.isLoading" class="loader mx-auto mt-64"></div>
    <div v-else>
      <div v-if="!track">
        <EmptyState />
      </div>
      <div v-else>
        <div class="grid grid-cols-1 xl:grid-cols-3 xl:gap-x-8 mb-16">
          <div class="col-span-2">
            <GeneralInfoPanel :track="track" />
            <button
              class="mt-4 text-textLightGrey hover:text-white duration-150 flex gap-x-2 items-center"
              @click="openReportModal"
              v-if="authStore.user?._id !== track.author._id"
            >
              <FlagIcon :size="20" />
              <span>Report</span>
            </button>
            <CommentsPanel class="hidden xl:block" :comments="track.comments" :track="track" @change-comments="getTrack" @toggleLike="toggleCommentLike" />
          </div>
          <div>
            <DetailsPanel :track="track" @track-like-toggled="toggleLike(track)" />
            <AuthorPanel :profile-id="track.author._id" />
            <CommentsPanel class="block xl:hidden" :comments="track.comments" :track="track" @change-comments="getTrack" @toggleLike="toggleCommentLike" />
          </div>
        </div>

        <!-- Report Modal -->
        <BaseModal :is-open="showReportModal" @close="showReportModal = false">
          <h2 class="text-xl mb-4">Report Track</h2>
          <p class="text-textLightGrey mb-4">Please describe why you're reporting this track:</p>
          <textarea
            v-model="reportMessage"
            class="base-input w-full h-32 resize-none mb-4"
            placeholder="Enter your report message (max 500 characters)"
            maxlength="500"
          ></textarea>
          <div class="flex justify-end gap-x-4">
            <BaseButton @click="showReportModal = false" :alt="true"> Cancel </BaseButton>
            <BaseButton @click="submitReport" :is-loading="wrapReport.isLoading" :disabled="!reportMessage.trim()"> Submit Report </BaseButton>
          </div>
        </BaseModal>

        <!-- Login Prompt Modal -->
        <LoginPromptModal :is-open="showLoginPrompt" message="Log in to report this track" @close="showLoginPrompt = false" />
      </div>
    </div>
  </ScreenWrapper>
</template>