<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import LikedTracks from '../components/LikedTracks.vue'
import FollowedProfiles from '../components/FollowedProfiles.vue';

const selectedTab = ref('uploads')

</script>
<template>
  <div>
    <div class="flex gap-x-8 mb-16">
      <BaseButton @click="selectedTab = 'uploads'" :alt="selectedTab !== 'uploads'">Liked uploads</BaseButton>
      <BaseButton @click="selectedTab = 'profiles'" :alt="selectedTab !== 'profiles'">Followed profiles</BaseButton>
    </div>
    <LikedTracks v-if="selectedTab === 'uploads'" />
    <FollowedProfiles v-else/>
  </div>
</template>
