import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ref } from 'vue'
import { useToastStore } from '../stores/toast'

const toastStore = useToastStore()

function useAsyncRequest<T>() {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function send(api: AxiosInstance, config: AxiosRequestConfig, handleError: boolean = true)  {
    try {
      isLoading.value = true

      //execute axios request as 'api' is axios instance
      //written that way so we can pass method in the config (like get, post, patch ...) as well as headers and
      //basically customize axios request
      const res = await api<T>(config)
    } catch (err) {
      console.log("Error")
      if (err instanceof Error) {
        //making sure err passed from try catch is an actual error instance
        //tbh I don't know how can it not be
        error.value = err
      }
      if (handleError) {
        //show generic notification
        toastStore.show({ title: 'Something went wrong', type: 'error' })
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    error: error.value,
    isLoading: isLoading.value,
    send,
  }
}

export default useAsyncRequest
