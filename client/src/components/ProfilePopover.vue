<script setup lang="ts">
import BasePopover from './base/BasePopover.vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { UserIcon } from './icons/index.vine'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'

const authStore = useAuthStore()
const router = useRouter()

const { user } = storeToRefs(authStore)

const wrapLogout = useAsyncWrap()

function logout() {
  wrapLogout.run(async () => {
    appApi.post('/auth/logout', {}, { withCredentials: true })

    authStore.accessToken = null
    authStore.user = null
  })
}
</script>

<template>
  <BasePopover v-if="user">
    <template #popover-button>
      <UserIcon class="clickable-icon" />
    </template>
    <template #popover-content>
      <div class="flex flex-col divide-y-2 divide-lightGray">
        <button @click="() => router.push('/profile/' + user?._id)" class="whitespace-nowrap py-2">View profile</button>
        <button v-if="user.roles.includes('admin')" @click="() => router.push('/admin')" class="whitespace-nowrap py-2">Admin</button>
        <button @click="logout" class="whitespace-nowrap py-2">Logout</button>
      </div>
    </template>
  </BasePopover>
</template>
