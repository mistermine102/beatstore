<script setup lang="ts">
import BaseButton from '../components/base/BaseButton.vue'
// import { useVuelidate } from '@vuelidate/core'
// import { required, helpers } from '@vuelidate/validators'
import { ref } from 'vue'
import useAsyncRequest from '../hooks/useAsyncRequest'
import appApi from '../api/appApi'
import type { AxiosResponse } from 'axios'

const email = ref('')
const password = ref('')

const loginReq = useAsyncRequest<{ user: User; token: string }>()

async function login() {
  const response = await loginReq.send(appApi, { method: 'post', url: '/auth12313' })

  console.log('this runs despite the error')

}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h2 class="base-heading">Log in</h2>
    <form class="flex flex-col p-4 w-1/2" @submit.prevent="login">
      <div class="mb-4">
        <input v-model="email" type="text" placeholder="Email" class="base-input w-full" />
      </div>
      <input v-model="password" type="password" placeholder="Password" class="base-input w-full" />
      <BaseButton :isLoading="loginReq.isLoading">Continue</BaseButton>
    </form>
    <div>
      <p>You don't have an account? <router-link class="base-link" to="/register">Sign up now</router-link></p>
    </div>
  </div>
</template>
