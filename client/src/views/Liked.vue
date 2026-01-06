<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import LikedTracks from '../components/profile/LikedTracks.vue'
import FollowedProfiles from '../components/profile/FollowedProfiles.vue';
import ScreenWrapper from '../components/common/ScreenWrapper.vue'

const selectedTab = ref('uploads')

</script>
<template>
  <ScreenWrapper>
    <div class="flex gap-x-8 mb-16">
      <BaseButton @click="selectedTab = 'uploads'" :alt="selectedTab !== 'uploads'" class="w-full" :class="selectedTab === 'uploads' ? 'hover:bg-primary' : ''">Liked uploads</BaseButton>
      <BaseButton @click="selectedTab = 'profiles'" :alt="selectedTab !== 'profiles'" class="w-full" :class="selectedTab === 'profiles' ? 'hover:bg-primary' : ''">Followed profiles</BaseButton>
    </div>
    <LikedTracks v-if="selectedTab === 'uploads'" />
    <FollowedProfiles v-else/>
  </ScreenWrapper>
</template>
