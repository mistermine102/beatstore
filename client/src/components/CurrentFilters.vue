<script setup lang="ts">
defineProps<{filters: Filter[]}>()
const emit = defineEmits(['removeFilter'])

function removeFilter(filterId: string, value?: string){
    emit('removeFilter', filterId, value)
}

</script>

<template>
      <div class="flex flex-wrap mb-2">
        <div v-for="filter in filters">
          <p v-if="filter.type === 'exact' && filter.value" class="mr-4">
            <span class="text-textLightGrey">{{ filter.label }}:</span> <span class="active-filter-badge" @click="removeFilter(filter.id)">{{ filter.value }}</span>
          </p>
          <p v-if="filter.type === 'range' && (filter.value.min || filter.value.max)" class="mr-4">
            <span class="text-textLightGrey">{{ filter.label }}:</span>
            <span class="active-filter-badge" @click="removeFilter(filter.id)"
              >{{ (filter.value.min && filter.value.max) ? `${filter.value.min} - ${filter.value.max}` : (filter.value.min && !filter.value.max) ? `Above ${filter.value.min}` : `Below ${filter.value.max}` }}</span
            >
          </p>
          <p v-if="filter.type === 'set' && filter.values.filter(el => el[1]).length" class="flex flex-wrap mr-4">
            <span class="text-textLightGrey">{{ filter.label }}:</span>
            <div v-for="val in filter.values">
             <span v-if="val[1]" :key="val[0]" @click="removeFilter(filter.id, val[0])" class="active-filter-badge mr-1">{{ val[0] }}</span>
            </div>
          </p>
        </div>
      </div>
</template>