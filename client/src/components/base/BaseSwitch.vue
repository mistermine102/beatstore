<script setup lang="ts">
interface Props {
  modelValue: boolean
  disabled?: boolean
}

const { disabled = false } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label class="relative inline-block w-10 h-5 cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': disabled }">
    <input type="checkbox" :checked="modelValue" :disabled="disabled" @change="updateValue" class="absolute opacity-0 w-0 h-0" />
    <span
      class="absolute inset-0 transition-colors duration-300 rounded-full"
      :class="[modelValue ? 'bg-primary' : 'bg-background', disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
    ></span>
    <span
      class="absolute bg-white w-4 h-4 top-0.5 left-0.5 rounded-full transition-transform duration-300 shadow"
      :class="{ 'translate-x-5': modelValue }"
    ></span>
  </label>
</template>
