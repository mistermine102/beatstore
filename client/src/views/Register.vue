<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import { useToastStore } from '../stores/toast'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { useAuthStore } from '../stores/auth'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import validator from 'validator'

const wrapRegister = reactive(useAsyncWrap()) 
const authStore = useAuthStore()
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
      const response = await appApi.post<{ user: User; token: string }>('/register', {
        email: email.value,
        username: username.value,
        password: password.value,
      })

      const { user, token } = response.data
      //set store values and local storage token
      authStore.setAuth(user, token)

      router.push('/')
      toastStore.show({ type: 'success', title: 'Logged in!' })
    },
    err => {
      if (err instanceof AxiosError && err.response) {
        switch (err.response.data.message) {
          case 'EMAIL_NOT_AVAILABLE':
            toastStore.show({ type: 'error', title: 'Email not available!' })
            break
          default:
            //show generic error toast
            toastStore.show({ type: 'error', title: 'Something went wrong' })
        }
      }
    }
  )
}
</script>

<template>
  <div class="flex flex-col items-center justify-center mt-16">
    <h2 class="base-heading">Sign up</h2>
    <form class="flex flex-col p-4 w-1/2 mt-8" @submit.prevent="register">
      <div class="flex flex-col gap-y-4 mb-8">
        <input v-model="email" type="text" placeholder="Email" class="base-input w-full" />
        <input v-model="username" type="text" placeholder="Username" class="base-input w-full" />
        <input v-model="password" type="password" placeholder="Password" class="base-input w-full" />
      </div>
      <BaseButton :isLoading="wrapRegister.isLoading">Continue</BaseButton>
    </form>
    <div>
      <p>Already have an account? <router-link class="base-link" to="/login">Log in now</router-link></p>
    </div>
  </div>
</template>
