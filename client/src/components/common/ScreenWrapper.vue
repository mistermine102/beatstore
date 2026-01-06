<script setup lang="ts">
import { computed } from 'vue'
import TheNavbar from '../TheNavbar.vue'
import TheFooter from '../TheFooter.vue'

type WidthVariant = 'default' | 'narrow' | 'full'

interface Props {
  width?: WidthVariant
  showNavbar?: boolean
  showFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 'default',
  showNavbar: true,
  showFooter: true,
})

const widthClasses: Record<WidthVariant, string> = {
  default: 'w-full max-w-[1400px] mx-auto px-6 md:px-8',
  narrow: 'w-full max-w-4xl mx-auto px-8',
  full: 'w-full',
}

const activeClass = computed(() => widthClasses[props.width])
</script>

<template>
  <div class="flex flex-col min-h-screen w-full">
    <slot name="header">
      <TheNavbar v-if="showNavbar" />
    </slot>
    <div :class="[activeClass, 'flex-1 flex flex-col']">
      <main class="flex-1 flex flex-col" :class="{ 'mt-[100px]': showNavbar }">
        <slot />
      </main>
    </div>
    <TheFooter v-if="showFooter" />
  </div>
</template>
