<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import { useToastStore } from '../stores/toast'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import validator from 'validator'
import { GENERIC_ERROR_TOAST } from '../constants'

const wrapRegister = reactive(useAsyncWrap())
const toastStore = useToastStore()
const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')

function validate() {
  //all of toasts in this function will be error toasts with this title
  const type: ToastType = 'error'
  const title = "Can't sign up"

  if (!validator.isEmail(email.value)) {
    toastStore.show({ type, title, message: 'Invalid email' })
    return false
  }
  if (!validator.isLength(username.value, { min: 4 })) {
    toastStore.show({ type, title, message: 'Username must be at least 4 characters long' })
    return false
  }
  if (!validator.isLength(username.value, { max: 25 })) {
    toastStore.show({ type, title, message: 'Username must be less than 25 characters long' })
    return false
  }
  if (!validator.isLength(password.value, { min: 6 })) {
    toastStore.show({ type, title, message: 'Password must be at least 6 characters long' })
    return false
  }
  return true
}

function register() {
  if (!validate()) return

  wrapRegister.run(
    async () => {
      await appApi.post('/auth/signup', {
        email: email.value,
        username: username.value,
        password: password.value,
      })

      router.push('/verify-user/check-email')
    },
    err => {
      if (err instanceof AxiosError && err.response) {
        switch (err.response.data.message) {
          case 'EMAIL_NOT_AVAILABLE':
            toastStore.show({ type: 'error', title: "Can't sign up", message: 'Email not available' })
            break
          case 'USERNAME_NOT_AVAILABLE':
            toastStore.show({ type: 'error', title: "Can't sign up", message: 'Username not available' })
            break
          default:
            //show generic error toast
            toastStore.show(GENERIC_ERROR_TOAST)
        }
      }
    }
  )
}
</script>

<template>
  <div class="panel w-full md:w-[600px] mx-auto bg-background">
    <h2 class="text-2xl font-bold mb-8 text-center">Create Account</h2>
    <form class="flex flex-col" @submit.prevent="register">
      <div class="flex flex-col gap-y-4 mb-8">
        <div class="relative">
          <input v-model="email" type="text" placeholder="Email" class="base-input w-full" />
        </div>
        <div class="relative">
          <input v-model="username" type="text" placeholder="Username" class="base-input w-full" />
        </div>
        <div class="relative">
          <input v-model="password" type="password" placeholder="Password" class="base-input w-full" />
        </div>
      </div>
      <BaseButton class="w-full" :isLoading="wrapRegister.isLoading">Sign Up</BaseButton>
    </form>
    <p class="text-textLightGrey text-sm mt-2">
      By registering, you confirm that you have read and agree to our
      <router-link to="/terms" class="font-semibold text-textLightGrey hover:text-white transition-colors underline">Terms of Service</router-link>
      and <router-link to="/privacy-policy" class="font-semibold text-textLightGrey hover:text-white transition-colors underline">Privacy Policy</router-link>.
    </p>
    <div class="mt-6 text-center">
      <p class="text-textLightGrey">
        Already have an account?
        <router-link class="text-primary hover:text-darkPrimary" to="/signin"> Sign in now </router-link>
      </p>
    </div>
  </div>
</template>
