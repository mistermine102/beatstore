<script setup lang="ts">
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import { ref } from 'vue'
import appApi from '../../api/appApi'
import useAsyncWrap from '../../composables/useAsyncWrap'
import { useToastStore } from '../../stores/toast'
import validator from 'validator'

const props = defineProps<{
  isOpen: boolean
  email?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const email = ref(props.email || '')
const toastStore = useToastStore()
const wrapResetPassword = useAsyncWrap()
const resetSent = ref(false)

function validateEmail(email: string): boolean {
  return validator.isEmail(email)
}

async function sendResetLink() {
  if (!email.value) {
    toastStore.show({ type: 'error', title: 'Please enter your email address' })
    return
  }

  if (!validateEmail(email.value)) {
    toastStore.show({ type: 'error', title: 'Please enter a valid email address' })
    return
  }

  wrapResetPassword.run(async () => {
    await appApi.post('/auth/reset-password', { email: email.value })
    resetSent.value = true
    toastStore.show({ type: 'success', title: 'Password reset link sent!' })
  })
}
</script>

<template>
  <BaseModal :is-open="isOpen" @close="emit('close')">
    <div class="h-full flex flex-col text-white">
      <!-- Header -->
      <div class="p-4 border-b border-white/10 flex items-center justify-center gap-x-4">
        <h2 class="text-3xl">Forgot Password</h2>
        <svg class="w-[48px]" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.42-7 9.88-3.87-1.45-7-5.2-7-9.88V6.3l7-3.12zm-2 5.82v2h4v-2h-4zm0 4v2h4v-2h-4z"
            fill="currentColor"
          />
        </svg>
      </div>

      <!-- Content -->
      <div class="p-8 flex-1 flex flex-col items-center justify-center gap-y-8">
        <div v-if="!resetSent" class="w-full max-w-md">
          <p class="text-center text-gray-300 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
          <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email address</label>
            <input type="email" id="email" v-model="email" class="base-input w-full" placeholder="Enter your email" @keyup.enter="sendResetLink" />
          </div>
          <BaseButton :is-loading="wrapResetPassword.isLoading.value" @click="sendResetLink" class="w-full"> Send Reset Link </BaseButton>
        </div>

        <div v-else class="w-full max-w-md">
          <p class="text-center text-gray-300">
            We've sent a password reset link to <span class="text-white">{{ email }}</span
            >. Check your inbox and follow the instructions to reset your password.
          </p>
          <div class="mt-6">
            <BaseButton @click="$emit('close')" class="w-full"> Close </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
