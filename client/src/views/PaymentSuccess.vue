<template>
  <div class="panel flex flex-col justify-center w-4/5 sm:w-3/4 md:w-1/2 mx-auto">
    <h1 class="text-[40px] mx-auto mt-16 font-secondary text-center">Payment Successful!</h1>
    <p class="text-textLightGrey text-center mb-8">Your purchase has been completed successfully.</p>
    <svg class="w-[96px] mx-auto mb-8 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
        fill="currentColor"
      />
    </svg>
    <div class="flex flex-col gap-y-4 justify-center items-center mb-8">
      <p class="text-textLightGrey text-center max-w-md">
        You can now download your purchased track. Check your profile for your purchased tracks and licenses.
      </p>
      <div class="flex gap-x-4">
        <BaseButton @click="$router.push('/')">Go to Home</BaseButton>
        <BaseButton @click="$router.push(`/profile/${authStore.user?._id}`)" alt>View My Purchases</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/base/BaseButton.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>
