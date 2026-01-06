<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  linkText?: string
  linkTo?: string | object
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
    <div>
      <h2 class="font-secondary text-4xl md:text-5xl mb-2 text-white tracking-wide uppercase">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-textLightGrey text-xl">
        {{ subtitle }}
      </p>
    </div>

    <router-link
      v-if="linkText && linkTo"
      :to="linkTo"
      class="text-primary hover:text-darkPrimary transition-colors font-semibold flex items-center gap-1 group mb-2"
    >
      {{ linkText }}
      <span class="transform group-hover:translate-x-1 transition-transform">→</span>
    </router-link>
  </div>
</template>
