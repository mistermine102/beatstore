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
  default: 'max-w-[1300px] mx-auto px-8',
  narrow: 'max-w-4xl mx-auto px-8',
  full: 'w-full',
}

const activeClass = computed(() => widthClasses[props.width])
</script>

<template>
  <div class="flex flex-col min-h-full w-full">
    <TheNavbar v-if="showNavbar" />
    <div :class="activeClass">
      <main class="flex-1 flex flex-col mt-[100px]">
        <slot />
      </main>
    </div>
    <TheFooter v-if="showFooter" />
  </div>
</template>
