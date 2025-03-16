<template>
  <div class="panel flex flex-col justify-center w-4/5 sm:w-3/4 md:w-1/2 mx-auto">
    <h1 class="text-[40px] mx-auto mt-16 font-secondary">Account verified!</h1>
    <svg class="w-[96px] mx-auto mb-8 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
        fill="currentColor"
      />
    </svg>
    <div class="flex justify-center">
      <BaseButton @click="$router.push('/signin')">Sign in now!</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/base/BaseButton.vue'
</script>
