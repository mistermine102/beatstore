<script setup lang="ts">
import useProfile from '../../composables/useProfile'
import EmptyState from '../EmptyState.vue'
import { HeartIcon } from '../icons/index.vine'

const props = defineProps<{ profileId: string }>()

const { profile, getProfile, isLoading, toggleFollow } = useProfile()

getProfile(props.profileId)
</script>

<template>
  <div v-if="isLoading" class="loader mx-auto mt-16"></div>
  <div v-else-if="!profile">
    <EmptyState />
  </div>
  <div v-else class="base-container">
    <div class="flex gap-2">
      <h2 class="text-2xl mb-4">Author</h2>
    </div>
    <div class="flex gap-4">
      <img :src="profile.image.url" alt="Profile image" class="image-thumbnail rounded-regular" />
      <div class="flex flex-col gap-2">
        <p class="text-xl">
          <router-link :to="`/profile/${profile._id}`">{{ profile.username }}</router-link>
        </p>
        <p class="text-textLightGrey">Specification: {{ profile.specification || 'None' }}</p>
        <div class="flex gap-x-2">
          <button @click="toggleFollow">
            <HeartIcon :class="[profile.isFollowed ? 'text-primary' : '']" />
          </button>
          <p>{{ profile.totalFollows }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
