<script setup lang="ts">
import appApi from '../../api/appApi'
import useAsyncWrap from '../../composables/useAsyncWrap'

const props = defineProps<{
  isOpen: boolean
  tiers: TrackPricingTier[]
  trackTitle: string
  trackId: string
}>()

defineEmits<{
  close: []
}>()

const wrapCheckout = useAsyncWrap()

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function handleTierClick(licenseId: string) {
  wrapCheckout.run(async () => {
    const response = await appApi.post<{ url: string }>('/payments/create-checkout-session', {
      trackId: props.trackId,
      licenseId,
    })
    window.open(response.data.url, '_blank')
  })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-40">
        <div class="absolute inset-0 bg-black/80" @click="$emit('close')"></div>
        <Transition name="modal">
          <div class="bg-background w-[90%] sm:w-auto sm:max-w-3xl relative z-10 rounded-xl p-8">
            <div class="border-b border-white/10 pb-4 mb-6">
              <h2 class="text-2xl font-secondary">Buy "{{ trackTitle }}"</h2>
            </div>

            <div class="flex flex-wrap gap-4">
              <div
                v-for="tier in tiers"
                :key="tier.license._id"
                class="p-4 rounded-regular cursor-pointer transition-all border bg-darkGrey border-white/[0.1] hover:border-primary hover:bg-primary/10"
                :style="{ flex: `1 1 calc(${100 / Math.min(tiers.length, 3)}% - 1rem)` }"
                @click="handleTierClick(tier.license._id)"
              >
                <p class="text-lg font-medium mb-2">{{ tier.license.title }}</p>
                <p class="text-sm text-textLightGrey">{{ tier.license.shortDescription }}</p>
                <p class="text-sm text-gray-400 mt-2">{{ tier.license.longDescription }}</p>
                <p class="text-xl font-bold text-primary mt-4">{{ formatPrice(tier.price) }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>