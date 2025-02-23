<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import ProfilePopover from './ProfilePopover.vue'
import { useRoute, useRouter } from 'vue-router'
import { HeartIcon } from './icons/index.vine'
import BaseSearchbar from './base/BaseSearchbar.vue'

const authStore = useAuthStore()
const router = useRouter()

const { user } = storeToRefs(authStore)
</script>

<template>
  <header class="fixed z-10 top-0 right-0 left-0 bg-darkGrey px-32 shadow-xl">
    <nav class="py-4 px-16 flex items-center justify-between">
      <div class="flex gap-x-32">
        <div class="flex justify-start">
          <router-link to="/" class="text-[18px] text-textLightGrey">wavsMarket</router-link>
        </div>
        <div class="items-start flex gap-x-16">
          <router-link to="/tracks/browse">Browse</router-link>
          <router-link to="/upload">Upload</router-link>
        </div>
      </div>
      <div class="flex justify-end">
        <div class="flex items-center gap-2" v-if="user">
          <router-link to="/liked" class="mr-16">
            <HeartIcon />
          </router-link>
          <p>
            Welcome <span class="text-primary">{{ user.username }}</span>
          </p>
          <ProfilePopover />
        </div>
        <router-link v-else class="base-btn px-16 text-center" to="/login">Login</router-link>
      </div>
    </nav>
  </header>
</template>
