<script setup lang="ts">
import { ref } from 'vue'
import { SearchIcon } from '../icons/index.vine'

interface Props {
  showButton?: boolean
  showIcon?: boolean
  inputClass?: string
  containerClass?: string
  buttonClass?: string
  placeholder?: string
}

const emit = defineEmits(['search'])

const { showButton = true, showIcon = false } = defineProps<Props>()

function onSubmit(e: Event) {
  e.preventDefault()
  emit('search', phrase.value)
}

const phrase = ref('')
</script>
<template>
  <form @submit="onSubmit" class="flex items-center gap-4">
    <slot name="customInput">
      <div class="w-full flex items-center" :class="containerClass">
        <input
          v-model="phrase"
          class="w-full h-full base-input px-2 py-2 text-white focus:outline-0"
          :class="inputClass"
          :placeholder="placeholder"
          type="text"
        />
        <button v-if="showIcon" class="flex items-center p-2">
          <SearchIcon />
        </button>
      </div>
    </slot>
    <button v-if="showButton" class="base-btn-alt w-fit" :class="buttonClass">Search</button>
  </form>
</template>
