<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../components/base/BaseButton.vue'
import useAsyncWrap from '../composables/useAsyncWrap'
import { useToastStore } from '../stores/toast'
import { AxiosError } from 'axios'
import appApi from '../api/appApi'
import validator from 'validator'
import { GENERIC_ERROR_TOAST } from '../constants'

const toastStore = useToastStore()
const wrapReset = reactive(useAsyncWrap())
const router = useRouter()
const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const token = ref('')

onMounted(() => {
  // Get token from URL
  token.value = (route.query.token as string) || ''

  if (!token.value) {
    toastStore.show({
      type: 'error',
      title: 'Invalid or missing reset token',
      message: 'Please use the link sent to your email.',
    })
    router.push('/login')
  }
})

// Validation messages
const PASSWORD_TOAST_MESSAGE = {
  type: 'error' as ToastType,
  title: 'Invalid password',
  message: 'Password must be at least 6 characters long',
}

const PASSWORDS_MATCH_TOAST_MESSAGE = {
  type: 'error' as ToastType,
  title: 'Passwords do not match',
  message: 'Please ensure both passwords are identical',
}

function validate() {
  if (!validator.isLength(password.value, { min: 6 })) {
    toastStore.show(PASSWORD_TOAST_MESSAGE)
    return false
  }

  if (password.value !== confirmPassword.value) {
    toastStore.show(PASSWORDS_MATCH_TOAST_MESSAGE)
    return false
  }

  return true
}

async function resetPassword() {
  // Validate input
  if (!validate()) return

  wrapReset.run(
    async () => {
      await appApi.patch('/auth/reset-password', {
        token: token.value,
        newPassword: password.value,
      })

      toastStore.show({
        type: 'success',
        title: 'Password reset successful!',
        message: 'You can now log in with your new password',
      })

      // Redirect to login page after successful reset
      router.push('/signin')
    },
    err => {
      if (err instanceof AxiosError && err.response) {
        switch (err.response.data.message) {
          case 'INVALID_TOKEN':
            toastStore.show({
              type: 'error',
              title: 'Invalid or expired token',
              message: 'Please request a new password reset',
            })
            router.push('/login')
            break
          default:
            toastStore.show(GENERIC_ERROR_TOAST)
        }
      } else {
        toastStore.show(GENERIC_ERROR_TOAST)
      }
    }
  )
}
</script>

<template>
  <div class="panel w-full md:w-[600px] mx-auto bg-background">
    <h2 class="text-2xl font-bold mb-8 text-center">Reset Your Password</h2>
    <form class="flex flex-col" @submit.prevent="resetPassword">
      <div class="flex flex-col gap-y-4 mb-8">
        <div class="relative">
          <input v-model="password" type="password" placeholder="New Password" class="base-input w-full" />
        </div>
        <div class="relative">
          <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" class="base-input w-full" />
        </div>
      </div>
      <BaseButton class="w-full" :is-loading="wrapReset.isLoading">Reset Password</BaseButton>
    </form>
    <div class="mt-6 text-center">
      <p class="text-textLightGrey">
        Remember your password?
        <router-link class="text-primary hover:text-darkPrimary" to="/login"> Sign in </router-link>
      </p>
    </div>
  </div>
</template>
