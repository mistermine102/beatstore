<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import BasePopover from './base/BasePopover.vue'
import { ChevronDownIcon, FilterIcon } from './icons/index.vine'

// Props for the filters
const props = defineProps<{ filters: Filter[] }>()
const emit = defineEmits(['filtersUpdated', 'removeFilter'])
</script>

<template>
  <div class="hidden sm:flex bg-grey py-3 px-4 gap-x-16 rounded-regular mb-2">
    <BasePopover v-for="filter in props.filters" :key="filter.id">
      <template #popover-button>
        <div class="flex text-textLightGrey/90 items-center gap-x-1">
          <p>{{ filter.label }}</p>
          <ChevronDownIcon class="text-textLightGrey/90" :size="20" />
        </div>
      </template>
      <template #popover-content>
        <div v-if="filter.type === 'range'" class="flex gap-x-2">
          <input v-model="filter.value.min" type="text" class="base-input px-2 py-1 w-[100px]" placeholder="From" />
          <input v-model="filter.value.max" type="text" class="base-input px-2 py-1 w-[100px]" placeholder="To" />
        </div>
        <div v-if="filter.type === 'exact'" class="flex gap-x-2">
          <input v-model="filter.value" type="text" class="base-input px-2 py-1 w-[100px]" :placeholder="filter.label" />
        </div>
        <div v-if="filter.type === 'set'">
          <div class="flex flex-col max-h-[150px] overflow-y-scroll">
            <div v-for="value of filter.values" :key="value[0]" class="base-checkbox">
              <input v-model="value[1]" type="checkbox" :name="value[0]" :id="value[0]" />
              <label :for="value[0]" class="p-2 text-nowrap">
                {{ value[0] }}
              </label>
            </div>
          </div>
        </div>
      </template>
    </BasePopover>
  </div>
  <div class="block sm:hidden">
    <div class="flex gap-x-4 gap-y-2 flex-wrap mb-4">
      <BasePopover v-for="filter in props.filters" :key="filter.id">
        <template #popover-button>
          <div class="flex text-textLightGrey/90 items-center gap-x-1">
            <p>{{ filter.label }}</p>
            <ChevronDownIcon class="text-textLightGrey/90" :size="20" />
          </div>
        </template>
        <template #popover-content>
          <div v-if="filter.type === 'range'" class="flex gap-x-2">
            <input v-model="filter.value.min" type="text" class="base-input px-2 py-1 w-[100px]" placeholder="From" />
            <input v-model="filter.value.max" type="text" class="base-input px-2 py-1 w-[100px]" placeholder="To" />
          </div>
          <div v-if="filter.type === 'exact'" class="flex gap-x-2">
            <input v-model="filter.value" type="text" class="base-input px-2 py-1 w-[100px]" :placeholder="filter.label" />
          </div>
          <div v-if="filter.type === 'set'">
            <div class="flex flex-col max-h-[150px] overflow-y-scroll">
              <div v-for="value of filter.values" :key="value[0]" class="base-checkbox">
                <input v-model="value[1]" type="checkbox" :name="value[0]" :id="value[0]" />
                <label :for="value[0]" class="p-2 text-nowrap">
                  {{ value[0] }}
                </label>
              </div>
            </div>
          </div>
        </template>
      </BasePopover>
    </div>
  </div>
</template>
