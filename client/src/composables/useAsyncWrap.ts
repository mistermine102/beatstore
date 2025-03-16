import { ref } from 'vue'
import { useToastStore } from '../stores/toast'
import { GENERIC_ERROR_TOAST } from '../constants'

function useAsyncWrap() {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const toastStore = useToastStore()

  async function run(fn: () => any, errorHandler?: (err: any) => void) {
    try {
      isLoading.value = true
      await fn()
    } catch (err) {
      if (errorHandler) {
        errorHandler(err)
      } else {
        //show generic notification
        toastStore.show(GENERIC_ERROR_TOAST)
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    error,
    isLoading,
    run,
  }
}

export default useAsyncWrap
