<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
</script>

<template>
  <Popover class="relative">
    <PopoverButton class="focus:outline-none flex justify-center items-center">
      <slot name="popover-button"></slot>
    </PopoverButton>
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute z-10 bg-darkGrey rounded-regular shadow-lg p-4">
        <slot name="popover-content"></slot>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
