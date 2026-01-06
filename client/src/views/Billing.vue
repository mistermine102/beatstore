<script setup lang="ts">
import BaseButton from '../components/base/BaseButton.vue'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const authStore = useAuthStore()
const wrapAction = useAsyncWrap()

const isConnectedAccountLinked = computed(() => {
  return authStore.user?.stripe?.isConnectedAccountLinked ?? false
})

function openDashboard() {
  wrapAction.run(async () => {
    const response = await appApi.get<{ url: string }>('/payments/dashboard-link')
    window.open(response.data.url, '_blank')
  })
}

function connectAccount() {
  wrapAction.run(async () => {
    const response = await appApi.post<{ url: string }>('/payments/connected-account')
    window.open(response.data.url, '_blank')
  })
}
</script>

<template>
  <ScreenWrapper>
    <div class="panel">
      <h1 class="text-4xl font-secondary mb-4">Billing</h1>
      <BaseButton v-if="isConnectedAccountLinked" @click="openDashboard" :is-loading="wrapAction.isLoading.value"> View dashboard </BaseButton>
      <BaseButton v-else @click="connectAccount" :is-loading="wrapAction.isLoading.value"> Connect account to stripe </BaseButton>
    </div>
  </ScreenWrapper>
</template>
