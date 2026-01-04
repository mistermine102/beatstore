<script setup lang="ts">
import BaseButton from './base/BaseButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <!-- Section Container with Gradient Background -->
  <section class="relative w-full py-24 bg-grey from-grey to-midGrey border-y border-midGrey overflow-hidden">
    

    <div class="max-w-[1300px] mx-auto px-6 md:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        <!-- Left: Text Content -->
        <div class="text-center lg:text-left">
          <h2 class="font-secondary text-[48px] md:text-[56px] leading-none text-white mb-6">
            MONETIZE<br>YOUR SOUND.
          </h2>
          
          <p class="text-textLightGrey text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            Don't let your hard drive gather dust. Upload your beats, loops, and drum kits to WavsMarket and reach thousands of artists instantly.
          </p>
          
          <!-- Features List -->

          <!-- TODO: Replace with actual check icons -->
          <div class="flex flex-col gap-4 mb-10 items-center lg:items-start">
            <div class="flex items-center gap-3 font-medium text-white">
              <span style="background-color: rgba(247, 101, 184, 0.1);" class="w-6 h-6 rounded-full text-primary flex items-center justify-center text-xs font-bold">✓</span>
              Keep 100% of revenue
            </div>
            <div class="flex items-center gap-3 font-medium text-white">
              <span style="background-color: rgba(247, 101, 184, 0.1);" class="w-6 h-6 rounded-full text-primary flex items-center justify-center text-xs font-bold">✓</span>
              Instant payouts via Stripe/PayPal
            </div>
            <div class="flex items-center gap-3 font-medium text-white">
              <span style="background-color: rgba(247, 101, 184, 0.1);" class="w-6 h-6 rounded-full text-primary flex items-center justify-center text-xs font-bold">✓</span>
              Customized storefront included
            </div>
          </div>

          <!-- CTA Button -->
          <BaseButton 
            @click="router.push('/register')" 
            size="large"
          >
            Start Selling Free
          </BaseButton>
        </div>

        <!-- Right: Image/Graphic -->
        <div class="relative rounded-xl overflow-hidden border border-midGrey shadow-2xl aspect-[16/10] group">
          <!-- Placeholder image - replace with actual dashboard screenshot later -->
          <img 
            src="https://placehold.co/800x500/111/333?text=Producer+Dashboard" 
            alt="WavsMarket Dashboard" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
        </div>

      </div>
    </div>
  </section>
</template>