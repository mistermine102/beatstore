<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { SearchIcon } from '../icons/index.vine'
import BaseButton from './BaseButton.vue'

interface Props {
  modelValue?: string
  showButton?: boolean
  showIcon?: boolean
  inputClass?: string
  containerClass?: string
  buttonClass?: string
  placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'search'])

// Use computed property to sync v-model with internal state
const phrase = computed({
  get: () => props.modelValue ?? '',
  set: value => emit('update:modelValue', value),
})

function onSubmit(e: Event) {
  e.preventDefault()
  emit('search', phrase.value)
}
</script>

<template>
  <form @submit="onSubmit" class="flex items-center gap-4">
    <slot name="customInput">
      <div class="w-full flex items-center bg-grey rounded-regular" :class="containerClass">
        <span v-if="showIcon" class="flex items-center p-2 text-iconLightGrey">
          <SearchIcon />
        </span>
        <input
          v-model="phrase"
          class="w-full h-full px-2 py-3 text-textLightGrey/90 focus:outline-0 bg-transparent"
          :class="inputClass"
          :placeholder="placeholder"
          type="text"
        />
      </div>
    </slot>
    <BaseButton v-if="showButton" :class="buttonClass" type="submit">Search</BaseButton>
  </form>
</template>
