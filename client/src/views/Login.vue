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

const authStore = useAuthStore()
const toastStore = useToastStore()
const wrapLogin = reactive(useAsyncWrap())
const router = useRouter()

const email = ref('szymonjarosz102@gmail.com')
const password = ref('szymon102')

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
        '/auth/login',
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
    <h2 class="base-heading">Sign in</h2>
    <form class="flex flex-col p-4 w-1/2" @submit.prevent="login">
      <div class="flex flex-col gap-y-4 mb-8">
        <input v-model="email" type="text" placeholder="Email" class="base-input w-full" />
        <input v-model="password" type="password" placeholder="Password" class="base-input w-full" />
      </div>
      <BaseButton class="w-full" :isLoading="wrapLogin.isLoading">Continue</BaseButton>
    </form>
    <div>
      <p>You don't have an account? <router-link class="base-link" to="/register">Sign up now</router-link></p>
    </div>
  </div>
</template>
