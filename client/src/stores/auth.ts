import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  return { user, accessToken }
})
