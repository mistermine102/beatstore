<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import { SearchIcon } from '../icons/index.vine'

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
      <div class="w-full flex items-center bg-grey" :class="containerClass">
        <span v-if="showIcon" class="flex items-center p-2 text-textLightGrey">
          <SearchIcon />
        </span>
        <input
          v-model="phrase"
          class="w-full h-full base-input px-2 py-3 text-white focus:outline-0"
          :class="inputClass"
          :placeholder="placeholder"
          type="text"
        />
      </div>
    </slot>
    <button v-if="showButton" class="base-btn-alt w-fit" :class="buttonClass">Search</button>
  </form>
</template>
