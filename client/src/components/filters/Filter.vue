<script setup lang="ts">
import BasePopover from '../base/BasePopover.vue'

interface Props {
  btnCaption: string
  popoverTitle: string
}

defineProps<Props>()
</script>

<template>
  <BasePopover>
    <template #popover-button>
      <div class="flex items-center gap-2">
        <span>{{ btnCaption }}</span>
      </div>
    </template>
    <template #popover-content>
      <div class="bg-darkGrey p-4 rounded-regular shadow-lg">
        <p class="mb-2 text">{{ popoverTitle }}</p>
        <slot></slot>
      </div>
    </template>
  </BasePopover>
</template>
