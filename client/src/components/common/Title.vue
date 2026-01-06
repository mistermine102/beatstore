<script setup lang="ts">
interface Props {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span'
}

withDefaults(defineProps<Props>(), {
  tag: 'h1',
})
</script>

<template>
  <component :is="tag" class="font-secondary text-4xl uppercase tracking-tight leading-none">
    <slot />
  </component>
</template>

<style scoped>
.font-secondary {
  font-family: var(--fontSecondary);
}
</style>
