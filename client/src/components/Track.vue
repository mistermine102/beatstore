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

//Props //optional props and render information based on wheter it's passed
