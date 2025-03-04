<template>
  <h1 class="text-[40px] mx-auto mt-16">Link expired!</h1>
  <p class="text-center text-textLightGrey mb-8">Your verification link has expired. Please register again.</p>
  <div class="flex justify-center">
    <BaseButton @click="$router.push('/register')">Register again!</BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/base/BaseButton.vue'
</script>
