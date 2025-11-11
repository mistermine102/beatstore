<template>
  <div class="panel flex flex-col justify-center w-4/5 sm:w-3/4 md:w-1/2 mx-auto">
    <h1 class="text-[40px] mx-auto mt-16 font-secondary text-center">Payment Cancelled</h1>
    <p class="text-textLightGrey text-center mb-8">Your payment was cancelled.</p>
    <svg class="w-[96px] mx-auto mb-8 text-yellow-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
        fill="currentColor"
      />
    </svg>
    <div class="flex flex-col gap-y-4 justify-center items-center mb-8">
      <p class="text-textLightGrey text-center max-w-md">
        No charges were made to your account. You can try purchasing again or continue browsing.
      </p>
      <div class="flex gap-x-4">
        <BaseButton @click="$router.push('/')">Go to Home</BaseButton>
        <BaseButton @click="$router.back()" alt>Go Back</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/base/BaseButton.vue'
</script>
