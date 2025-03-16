<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '../icons/index.vine'
import { computed, ref, watch } from 'vue'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  modelValue: string[]
  placeholder?: string
}

//objects with value and label
const { options: optionsProp, modelValue, placeholder = 'Select a value' } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const initialOptions = optionsProp.map(o => {
  const isChecked = modelValue.includes(o.value)

  return {
    ...o,
    isChecked,
  }
})

//added isChecked property, only for use in this component
const options = ref<(Option & { isChecked: boolean })[]>(initialOptions)

const selectedOptions = computed(() => options.value.filter(o => o.isChecked))

watch(
  options,
  () => {
    //whenever options array changes (some option got checked or unchecked)
    //emit just an array of selected option values ["value1", "value2" ...]
    emit(
      'update:modelValue',
      selectedOptions.value.map(o => o.value)
    )
  },
  { deep: true }
)
</script>
<template>
  <Popover class="relative">
    <PopoverButton class="popover-button base-input w-full flex justify-between">
      <span v-if="!selectedOptions.length" class="text-textLightGrey">{{ placeholder }} </span>
      <div v-else>
        <span>{{ selectedOptions[0].label }}</span>
        <span v-tippy="selectedOptions.map(o => o.label).toString()" v-if="selectedOptions.length > 1" class="ml-2 text-primary">
          {{ selectedOptions.length - 1 }} more</span
        >
      </div>
      <ChevronDownIcon class="ml-2" :size="20" />
    </PopoverButton>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute z-20 bg-darkGrey rounded-regular shadow-lg p-2 min-w-32 w-full mt-1 max-h-[300px] overflow-y-scroll">
        <div v-for="option in options" class="base-checkbox">
          <input type="checkbox" v-model="option.isChecked" :id="option.value" />
          <label :for="option.value" class="p-2 text-nowrap">
            {{ option.label }}
          </label>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
