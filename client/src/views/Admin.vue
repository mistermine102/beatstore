<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '../components/base/BaseButton.vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const router = useRouter()
</script>

<template>
  <ScreenWrapper>
    <h1 class="base-heading text-left">Admin Panel</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <BaseButton alt class="w-full h-64 text-2xl" @click="router.push('/admin/uploads')">
        <div class="flex flex-col justify-center items-center gap-4">
          <svg class="w-[48px]" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
              fill="currentColor"
            />
          </svg>
          <h2 class="text-2xl">Verify Uploads</h2>
        </div>
      </BaseButton>
      <BaseButton alt class="w-full h-64 text-2xl" @click="router.push('/admin/reports')">
        <div class="flex flex-col justify-center items-center gap-4">
          <svg class="w-[48px]" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 2h10v2h8v14H11v-2H5v6H3V2zm2 12h8v2h6V6h-8V4H5v10z" fill="currentColor" />
          </svg>
          <h2 class="text-2xl">Manage Reports</h2>
        </div>
      </BaseButton>
      <BaseButton alt class="w-full h-64 text-2xl" @click="router.push('/admin/featured')">
        <div class="flex flex-col justify-center items-center gap-4">
          <svg class="w-[48px]" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 3h8v2H3v12h8V5h2v12h8V5h-8V3h10v16H13v2h-2v-2H1V3h2zm16 7h-4v2h4v-2zm-4-3h4v2h-4V7zm2 6h-2v2h2v-2z" fill="currentColor" />
          </svg>
          <h2 class="text-2xl">Manage Featured Profiles</h2>
        </div>
      </BaseButton>
    </div>
  </ScreenWrapper>
</template>