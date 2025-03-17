<script setup lang="ts">
import BaseModal from './base/BaseModal.vue'
import BaseButton from './base/BaseButton.vue'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import { useToastStore } from '../stores/toast'

const props = defineProps<{
  isOpen: boolean
  email: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toastStore = useToastStore()
const wrapResend = useAsyncWrap()

async function resendVerification() {
  wrapResend.run(async () => {
    await appApi.post('/auth/resend-verification', { email: props.email })
    toastStore.show({ type: 'success', title: 'Verification email sent!' })
    emit('close')
  })
}
</script>

<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <div class="h-full flex flex-col text-white">
      <!-- Header -->
      <div class="p-4 border-b border-white/10 flex items-center justify-center gap-x-4">
        <h2 class="text-3xl">Please Check Your Email</h2>
        <svg class="w-[48px]" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M22 4H2v16h20V4zM4 18V6h16v12H4zM8 8H6v2h2v2h2v2h4v-2h2v-2h2V8h-2v2h-2v2h-4v-2H8V8z" fill="currentColor" />
        </svg>
      </div>

      <!-- Content -->
      <div class="p-8 flex-1 flex flex-col items-center justify-center gap-y-8">
        <p class="text-center text-gray-300">
          We've sent a verification link to <span class="text-white">{{ email }}</span
          >. Haven't received it? You can request a new one.
        </p>
        <BaseButton :is-loading="wrapResend.isLoading.value" @click="resendVerification"> Resend Verification Email </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
