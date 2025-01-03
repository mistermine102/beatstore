<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseFileInput from './base/BaseFileInput.vue'

interface Props {
  maxFileSize: string
  id: string
  accept: string
}

interface Emits {
  (e: 'fileSelected', file: File): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const file = ref<File | null>(null)

function selectFile(selectedFile: File) {
  file.value = selectedFile
  emit('fileSelected', selectedFile)
}

const formattedFileSize = computed(() => {
  if (!file.value) return ''

  const fileSize = file.value.size.toString()

  if (fileSize.length < 7) return `${Math.round(+fileSize / 1024).toFixed(2)}kb`
  return `${(Math.round(+fileSize / 1024) / 1000).toFixed(2)}MB`
})
</script>

<template>
  <div class="border-2 border-dashed border-primary rounded-regular">
    <label :for="id" class="cursor-pointer w-full h-full p-8">
      <div v-if="!file" class="flex flex-col items-center justify-center">
        <slot name="icon"></slot>
        <p class="mt-4">Drag and drop or <span class="base-link">select a file</span></p>
      </div>
      <div v-else class="flex flex-col items-center justify-center gap-4">
        <span>{{ file.name }}</span>
        <span class="text-textPrimary">{{ formattedFileSize }}</span>
        <span class="text-gray-300 text-sm">Max file size is {{ maxFileSize }}</span>
      </div>
    </label>
    <BaseFileInput @fileSelected="selectFile" :id="id" :accept="accept" />
  </div>
</template>
