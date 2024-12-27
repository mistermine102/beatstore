<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
</script>

<template>
  <Popover ref="popover" class="relative">
    <PopoverButton class="focus:outline-none mb-1">
      <slot name="popover-button"></slot>
    </PopoverButton>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute z-10">
        <slot name="popover-content"></slot>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
