<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '../components/base/BaseButton.vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <ScreenWrapper>
    <div class="flex flex-col justify-center items-center p-4">
      <div class="text-center max-w-xl w-full mt-16 flex flex-col items-center">
        <h1 class="text-[64px] mb-4 font-secondary">404</h1>
        <h2 class="text-2xl mb-6">Page Not Found</h2>

        <p class="text-lg mb-8 text-textLightGrey">
          The page you're looking for doesn't exist or has been moved. Don't worry, we'll help you find your way back.
        </p>

        <BaseButton alt class="w-full max-w-xs mx-auto text-xl py-4" @click="goHome"> Return to Home </BaseButton>
      </div>
    </div>
  </ScreenWrapper>
</template>