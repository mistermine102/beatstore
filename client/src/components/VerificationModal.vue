<script setup lang="ts">
defineOptions({
  name: 'VerificationModal'
})

defineProps<{
  onClose: () => void
}>()
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-bgDark p-8 rounded-lg max-w-md w-full mx-4">
      <div class="text-center">
        <h2 class="text-2xl">Check your email</h2>
      </div>
    </div>
  </div>
</template> 