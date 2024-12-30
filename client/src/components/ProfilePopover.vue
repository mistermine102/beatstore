<script setup lang="ts">
import BasePopover from './base/BasePopover.vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { UserIcon } from './icons/index.vine'

const authStore = useAuthStore()
const router = useRouter()

const { user } = storeToRefs(authStore)

function logout() {
  authStore.token = null
  authStore.user = null
  localStorage.removeItem('token')
}
</script>

<template>
  <BasePopover v-if="user">
    <template #popover-button>
      <div class="flex justify-center items-center">
        <UserIcon />
      </div>
    </template>
    <template #popover-content>
      <div class="flex flex-col divide-y-2 divide-lightGray">
        <button @click="() => router.push('/profile/' + user?._id)" class="whitespace-nowrap py-2">View profile</button>
        <button @click="logout" class="whitespace-nowrap py-2">Logout</button>
      </div>
    </template>
  </BasePopover>
</template>
