<script setup lang="ts">
interface Props {
  track: Track
}

defineProps<Props>()
</script>
<template>
  <div>
    {{ track.title }}
  </div>
</template>
