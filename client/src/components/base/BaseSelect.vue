<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ref, watch } from 'vue'
import { ChevronDownIcon } from '../icons/index.vine'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  modelValue: string
  placeholder?: string
}

const { options, modelValue, placeholder = 'Select a value' } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const selectedOption = ref<Option | null>(options.find(o => o.value === modelValue) || null)

watch(selectedOption, () => {
  emit('update:modelValue', selectedOption.value ? selectedOption.value.value : null)
})

function selectOption(option: Option, close: any) {
  selectedOption.value = option
  //emit an event with selected option
  emit('update:modelValue', option.value)
  close()
}
</script>
<template>
  <Popover class="relative">
    <PopoverButton class="base-input w-full h-full flex justify-between">
      <span v-if="selectedOption" class="text-textLightGrey/90">{{ selectedOption.label }}</span>
      <span v-else class="text-textLightGrey/90">{{ placeholder }}</span>
      <ChevronDownIcon class="text-textLightGrey/90" :size="20" />
    </PopoverButton>
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        v-slot="{ close }"
        class="absolute z-20 bg-darkGrey rounded-regular shadow-lg p-2 min-w-32 w-full mt-1 max-h-[300px] overflow-y-scroll"
      >
        <div
          v-for="option in options"
          @click="selectOption(option, close)"
          class="hover:bg-grey px-4 py-2 cursor-pointer rounded-regular"
          :class="selectedOption?.value === option.value ? 'text-primary' : ''"
        >
          <span>{{ option.label }}</span>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
