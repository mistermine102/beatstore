<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'fileSelected', file: File): void
}

defineProps<{ accept: string }>()

const emit = defineEmits<Emits>()

const file = ref<File | null>(null)

function selectFile(event: Event) {
  const target = event.target as HTMLInputElement

  if (target.files) {
    file.value = target.files[0]

    emit('fileSelected', file.value)
  }
}
</script>

<template>
  <input @change="selectFile" type="file" class="hidden" :accept="accept" />
</template>
