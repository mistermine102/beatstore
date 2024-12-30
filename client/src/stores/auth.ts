import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  function setAuth(newUser: User, newToken: string) {
    localStorage.setItem('token', newToken)

    user.value = newUser
    token.value = newToken
  }

  return { user, token, setAuth }
})
