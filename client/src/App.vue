<script setup lang="ts">
import Toast from './components/Toast.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'
import appApi from './api/appApi'
import TheAudioPlayer from './components/TheAudioPlayer.vue'
import { useAudioPlayerStore } from './stores/audioPlayer'
import useAsyncWrap from './composables/useAsyncWrap'
import { AxiosError } from 'axios'
import { useToastStore } from './stores/toast'
import { GENERIC_ERROR_TOAST } from './constants'

const authStore = useAuthStore()
const audioPlayerStore = useAudioPlayerStore()
const toastStore = useToastStore()

const wrapLocalLogin = useAsyncWrap()

async function localLogin() {
  wrapLocalLogin.run(
    async () => {
      const response = await appApi.post<{ user: User; accessToken: string; message?: string }>('/auth/get-user', {}, { withCredentials: true })
      if (response.data?.message === 'REFRESH_TOKEN_NOT_PROVIDED') return

      authStore.user = response.data.user
      authStore.accessToken = response.data.accessToken
    },
    err => {
      if (err instanceof AxiosError && err.response) {
        switch (err.response.data.message) {
          case 'TOKEN_NOT_PROVIDED':
            break
          default:
            //show generic error toast
            toastStore.show(GENERIC_ERROR_TOAST)
        }
      }
    }
  )
}

onMounted(() => {
  localLogin()
})
</script>

<template>
  <Toast />
  <TheAudioPlayer v-if="audioPlayerStore.track" />
  <div class="min-h-[100vh] bg-background flex flex-col justify-between" :class="audioPlayerStore.track ? 'mb-[100px]' : ''">
    <TheNavbar />
    <main class="flex flex-col flex-1 px-[10px] sm:px-[25px] lg:px-[100px] xl:px-[150px] 2xl:px-[300px] mt-[100px]">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>
