<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['search'])

function onSubmit(e: Event) {
  e.preventDefault()
  emit('search', phrase.value)
}

const phrase = ref('')

</script>
<template>
  <form @submit="onSubmit" class="flex items-center gap-4">
    <input v-model="phrase" class="w-full base-input bg-white focus:outline-black px-2 py-2 border-2 text-grey" placeholder="What are you looking for?" type="text" />
    <button class="base-btn-alt w-fit">Search</button>
  </form>
</template>
