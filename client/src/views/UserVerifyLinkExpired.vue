<template>
  <div class="panel flex flex-col justify-center w-4/5 sm:w-3/4 md:w-1/2 mx-auto">
    <h1 class="text-[40px] mx-auto mt-16 font-secondary">Link expired!</h1>
    <p class="text-center text-textLightGrey mb-8">Your verification link has expired. Please sign up again.</p>
    <div class="flex justify-center">
      <BaseButton @click="$router.push('/signup')">Sign up again!</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/base/BaseButton.vue'
</script>
