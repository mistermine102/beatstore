<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import ProfilePopover from './ProfilePopover.vue'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

const { user } = storeToRefs(authStore)
</script>

<template>
  <header class="fixed z-[1] top-0 right-0 left-0 bg-darkGrey px-32">
    <nav class="grid grid-cols-4 py-4 px-16 items-center">
      <div class="flex justify-start">Wavstand</div>
      <ul class="col-span-2 flex items-center justify-center gap-8">
        <li>
          <router-link to="/" class="flex gap-1 items-center">
            <span class="border-b-2" :class="[route.path === '/' ? 'border-b-primary' : '']">Home</span>
          </router-link>
        </li>
        <li>
          <router-link v-if="user" to="/upload" class="flex gap-1 items-center">
            <span class="border-b-2" :class="[route.path === '/upload' ? 'border-b-primary' : '']">Upload</span>
          </router-link>
        </li>
      </ul>
      <div class="flex justify-end">
        <div class="flex items-center gap-2" v-if="user">
          <p>
            Welcome <span class="text-textPrimary">{{ user.username }}</span>
          </p>
          <ProfilePopover />
        </div>
        <router-link v-else class="base-btn w-1/2 text-center" to="/login">Login</router-link>
      </div>
    </nav>
  </header>
</template>
