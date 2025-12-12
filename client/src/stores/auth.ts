import { defineStore } from 'pinia'
import { ref } from 'vue'
import appApi from '../api/appApi'
import { AxiosError } from 'axios'
import { GENERIC_ERROR_TOAST } from '../constants'
import useAsyncWrap from '../composables/useAsyncWrap'
import { useToastStore } from './toast'

export const useAuthStore = defineStore('authStore', () => {
  const toastStore = useToastStore()
  const wrapLocalLogin = useAsyncWrap()

  const user = ref<User | null | undefined>(undefined)
  const accessToken = ref<string | null>(null)

  async function localLogin() {
    await wrapLocalLogin.run(
      async () => {
        const response = await appApi.post<{ user: User; accessToken: string; message?: string }>('/auth/get-user', {}, { withCredentials: true })
        if (response.data?.message === 'REFRESH_TOKEN_NOT_PROVIDED') {
          user.value = null
          return
        }

        console.log("USER: ", response.data.user)

        user.value = response.data.user
        accessToken.value = response.data.accessToken
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

  return { user, accessToken, isLoading: wrapLocalLogin.isLoading, localLogin }
})
