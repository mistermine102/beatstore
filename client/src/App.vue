<script setup lang="ts">
import Toast from './components/Toast.vue'
import TheNavbar from './components/TheNavbar.vue'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'
import appApi from './api/appApi'

const authStore = useAuthStore()

async function localLogin() {
  const storedToken = localStorage.getItem('token')
  if (!storedToken) return

  authStore.token = storedToken

  const response = await appApi.get<{ user: User }>('/auth/' + storedToken)
  authStore.user = response.data.user
}

onMounted(() => {
  localLogin()
})
</script>

<template>
  <div class="min-h-[100vh] bg-background flex flex-col justify-between">
    <Toast />
    <TheNavbar />
    <main class="flex flex-col flex-1 px-[10px] sm:px-[25px] lg:px-[100px] xl:px-[150px] 2xl:px-[300px] mt-[100px]">
      <RouterView />
    </main>
    <!-- <TheFooter></TheFooter> -->
  </div>
</template>
