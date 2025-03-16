<script setup lang="ts">
import useProfile from '../../composables/useProfile'
import EmptyState from '../EmptyState.vue'
import LoginPromptModal from '../../components/LoginPromptModal.vue'
import BaseButton from '../../components/base/BaseButton.vue'

const props = defineProps<{ profileId: string }>()

const { profile, getProfile, isLoading, toggleFollow, showLoginPrompt, isFollowLoading } = useProfile()

getProfile(props.profileId)
</script>

<template>
  <div v-if="isLoading" class="loader mx-auto mt-16"></div>
  <div v-else-if="!profile">
    <EmptyState />
  </div>
  <div v-else class="panel mb-8">
    <h2 class="base-heading">Author</h2>
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-6 min-w-0 flex-1 pr-4">
        <!-- Author Image and Basic Info -->
        <div class="flex gap-4 items-center">
          <img :src="profile.image.url" alt="Profile image" class="w-14 h-14 rounded-full object-cover shrink-0" />
          <div class="min-w-0 flex-1">
            <router-link :to="`/profile/${profile._id}`" class="font-secondary text-lg hover:text-primary duration-150 truncate block">
              {{ profile.username }}
            </router-link>
            <p class="text-textLightGrey truncate">{{ profile.specification || 'No specification' }}</p>
          </div>
        </div>
      </div>
      <BaseButton @click="toggleFollow" :is-loading="isFollowLoading" size="small" :alt="true" class="!bg-background shrink-0" :class="profile.isFollowed ? 'text-primary' : ''">
        {{ profile.isFollowed ? 'Unfollow' : 'Follow' }}
      </BaseButton>
    </div>
  </div>

  <LoginPromptModal :is-open="showLoginPrompt" message="Log in to follow this profile" @close="showLoginPrompt = false" />
</template>