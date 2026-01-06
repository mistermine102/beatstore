<script setup lang="ts">
defineProps<{ imageUrl?: string; upperText: string; lowerText?: string; isSelected: boolean; rightText?: string }>()
</script>

<template>
  <li
    class="flex items-center justify-between border border-background hover:bg-grey hover:border-white/[0.1] p-2 rounded-regular w-full cursor-pointer"
    :class="isSelected ? 'bg-darkGrey border-white/[0.1] hover:bg-darkGrey hover:border-background' : ''"
  >
    <div class="flex gap-x-2">
      <img v-if="imageUrl" class="h-[50px] rounded-regular" :src="imageUrl" alt="List item image" />
      <div>
        <p class="text-left">{{ upperText }}</p>
        <p class="text-textLightGrey">{{ lowerText }}</p>
      </div>
    </div>
    <p class="text-textLightGrey">{{ rightText }}</p>
  </li>
</template>
