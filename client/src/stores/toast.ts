import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toastStore', () => {
  const DURATION = 3000

  const isOpen = ref(false)
  const type = ref<ToastType>('info')
  const title = ref('')
  const message = ref('')

  function show(options: { type: ToastType; title: string; message?: string }) {
    if (!options.message) {
      options.message = ''
    }

    isOpen.value = true
    type.value = options.type
    title.value = options.title
    message.value = options.message

    setTimeout(() => {
      isOpen.value = false
    }, DURATION)
  }

  return { isOpen, type, title, message, show }
})
