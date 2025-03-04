<template>
  <div class="flex flex-col items-center">
    <h1 class="text-[40px] mx-auto mt-16">Check your email!</h1>
    <svg class="w-[96px] mx-auto mb-8" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M22 4H2v16h20V4zM4 18V6h16v12H4zM8 8H6v2h2v2h2v2h4v-2h2v-2h2V8h-2v2h-2v2h-4v-2H8V8z" fill="currentColor" />
    </svg>
    <p class="text-center text-textLightGrey mb-8">We've sent you a verification link. Please check your email and verify your account.</p>
    <BaseButton @click="$router.push('/login')">Got it</BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/base/BaseButton.vue'
</script>
