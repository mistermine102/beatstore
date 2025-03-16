<script setup lang="ts">
import BaseModal from './base/BaseModal.vue'
import BaseButton from './base/BaseButton.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  isOpen: boolean
  message: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()

function goToLogin() {
  router.push('/signin')
  emit('close')
}
</script>

<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <div class="h-full flex flex-col text-white">
      <!-- Header -->
      <div class="border-b border-white/10 pb-4">
        <h2 class="text-[24px]">Join the Community</h2>
      </div>

      <!-- Content -->
      <div class="flex-1 flex flex-col items-center justify-center gap-y-8">
        <p class="text-center text-textLightGrey text-lg">
          {{ message }}
        </p>
        <BaseButton @click="goToLogin">Log in</BaseButton>
      </div>
    </div>
  </BaseModal>
</template> 