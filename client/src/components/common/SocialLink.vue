<script setup lang="ts">
  import { PLATFORM_ICONS } from '../../constants';

defineProps<{ link: SocialLink }>()
</script>

<template>
  <div class="flex items-center w-fit overflow-hidden">
    <div class="mr-3" v-html="PLATFORM_ICONS[link.platform]"></div>
    <div>
      <a :href="link.url" target="_blank" rel="noopener noreferrer" class="text-textLightGrey hover:underline truncate">
        {{ link.url.replace('https://', '') }}
      </a>
    </div>
  </div>
</template>
