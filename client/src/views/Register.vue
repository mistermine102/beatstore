<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import { useToastStore } from '../stores/toast'
import useAsyncWrap from '../hooks/useAsyncWrap'
import appApi from '../api/appApi'
import { useAuthStore } from '../stores/auth'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

const wrapRegister = useAsyncWrap()
const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')

function register() {
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
        }
      }
    }
  )
}
</script>

<template>
  <div class="flex flex-col items-center justify-center mt-16">
    <h2 class="base-heading">Sign up</h2>
    <form class="flex flex-col gap-4 p-4 w-1/2 mt-8" @submit.prevent="register">
      <input v-model="email" type="text" placeholder="Email" class="base-input w-full" />
      <input v-model="username" type="text" placeholder="Username" class="base-input w-full" />
      <input v-model="password" type="password" placeholder="Password" class="base-input w-full" />
      <BaseButton :isLoading="wrapRegister.isLoading.value">Continue</BaseButton>
    </form>
    <div>
      <p>Already have an account? <router-link class="base-link" to="/login">Log in now</router-link></p>
    </div>
  </div>
</template>
