<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/base/BaseButton.vue'
import useAsyncWrap from '../composables/useAsyncWrap'
import { useToastStore } from '../stores/toast'
import { AxiosError } from 'axios'
import appApi from '../api/appApi'
import { useRouter } from 'vue-router'
import validator from 'validator'
import ResendVerificationModal from '../components/ResendVerificationModal.vue'
import { GENERIC_ERROR_TOAST } from '../constants'

const authStore = useAuthStore()
const toastStore = useToastStore()
const wrapLogin = reactive(useAsyncWrap())
const router = useRouter()

const email = ref('szymonjarosz102@gmail.com')
const password = ref('123456')
const showVerificationModal = ref(false)

//create this object so we show the same error message regardless of what happens
//(wheter frontend validation fails or backend validation fails)
const LOGIN_TOAST_MESSAGE = {
  type: 'error' as ToastType,
  title: 'Invalid email or password',
}

function validate() {
  if (!validator.isEmail(email.value)) return false
  if (!validator.isLength(password.value, { min: 6 })) return false
  return true
}

async function login() {
  //validate input
  if (!validate()) return toastStore.show(LOGIN_TOAST_MESSAGE)

  wrapLogin.run(
    async () => {
      const response = await appApi.post<{ user: User; accessToken: string }>(
        '/auth/signin',
        {
          email: email.value,
          password: password.value,
        },
        { withCredentials: true }
      )

      const { user, accessToken } = response.data

      authStore.user = user
      authStore.accessToken = accessToken

      router.push('/')
      toastStore.show({ type: 'success', title: 'Logged in!' })
    },
    err => {
      if (err instanceof AxiosError && err.response) {
        //axios error
        switch (err.response.data.message) {
          case 'INVALID_CREDENTIALS':
            //show invalid email or password toast
            toastStore.show(LOGIN_TOAST_MESSAGE)
            break
          case 'USER_NOT_VERIFIED':
            showVerificationModal.value = true
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
    <h2 class="text-2xl font-bold mb-8 text-center">Welcome Back</h2>
    <form class="flex flex-col" @submit.prevent="login">
      <div class="flex flex-col gap-y-4 mb-8">
        <div class="relative">
          <input v-model="email" type="text" placeholder="Email" class="base-input w-full" />
        </div>
        <div class="relative">
          <input v-model="password" type="password" placeholder="Password" class="base-input w-full" />
        </div>
      </div>
      <BaseButton class="w-full" :is-loading="wrapLogin.isLoading">Sign In</BaseButton>
    </form>
    <div class="mt-6 text-center">
      <p class="text-textLightGrey">
        Don't have an account?
        <router-link class="text-primary hover:text-darkPrimary" to="/signup"> Sign up now </router-link>
      </p>
    </div>
  </div>

  <ResendVerificationModal :is-open="showVerificationModal" :email="email" @close="showVerificationModal = false" />
</template>
