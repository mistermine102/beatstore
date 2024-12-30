<script setup lang="ts">
import BasePopover from '../base/BasePopover.vue'
import { ChevronDownIcon } from '../icons/index.vine'

interface Props {
  btnCaption: string
  popoverTitle: string
}

defineProps<Props>()
</script>

<template>
  <BasePopover>
    <template #popover-button>
      <div class="flex items-center">
        <span>{{ btnCaption }}</span>
        <ChevronDownIcon />
      </div>
    </template>
    <template #popover-content>
      <p class="mb-2 text">{{ popoverTitle }}</p>
      <slot></slot>
    </template>
  </BasePopover>
</template>
