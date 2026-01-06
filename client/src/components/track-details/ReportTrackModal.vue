<script setup lang="ts">
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import { ref } from 'vue'
import appApi from '../../api/appApi'
import useAsyncWrap from '../../composables/useAsyncWrap'
import { useToastStore } from '../../stores/toast'

const props = defineProps<{
  isOpen: boolean
  trackId: string
  trackTitle: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const message = ref('')
const toastStore = useToastStore()
const wrapSubmit = useAsyncWrap()

async function submitReport() {
  if (!message.value.trim()) {
    toastStore.show({ type: 'error', title: 'Please provide a reason for reporting' })
    return
  }

  wrapSubmit.run(async () => {
    await appApi.post('/reports', {
      trackId: props.trackId,
      message: message.value.trim(),
    })
    toastStore.show({ type: 'success', title: 'Report submitted successfully' })
    message.value = ''
    emit('close')
  })
}
</script>

<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <div class="h-full flex flex-col text-white">
      <!-- Header -->
      <div class="p-8 border-b border-white/10 bg-darkGrey">
        <h2 class="text-[24px]">Report Track</h2>
      </div>

      <!-- Content -->
      <div class="p-8 flex-1 flex flex-col gap-y-6 bg-darkGrey">
        <div>
          <p class="text-gray-300 mb-2">Track:</p>
          <p class="text-white">{{ trackTitle }}</p>
        </div>

        <div class="flex-1">
          <p class="text-gray-300 mb-2">Reason for reporting:</p>
          <textarea
            v-model="message"
            class="w-full h-[120px] bg-white/5 text-white p-3 resize-none focus:outline-none"
            placeholder="Please describe why you're reporting this track..."
            maxlength="500"
          ></textarea>
          <p class="text-right text-gray-400 text-sm mt-1">{{ message.length }}/500</p>
        </div>

        <BaseButton :is-loading="wrapSubmit.isLoading.value" @click="submitReport" class="w-full"> Submit Report </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
