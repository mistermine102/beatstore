<script setup lang="ts">
import { ref } from 'vue'
import BaseSearchbar from './base/BaseSearchbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchPhrase = ref('')

const handleSearch = (phrase: string) => {
  router.push(`/tracks/browse?q=${phrase}`)
}
</script>

<template>
  <section class="hero-section relative w-full pt-20 pb-20 lg:pt-[200px] lg:pb-[200px] border-b border-midGrey overflow-hidden">
    <div 
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(circle at 80% 20%, var(--darkPrimary) 0%, transparent 60%); opacity: 0.2;"
    ></div>

    <div class="max-w-[1300px] mx-auto px-6 md:px-8 relative z-10">
      <div class="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-20">
        <div class="flex-1 w-full text-center lg:text-left">
          <h1 class="font-secondary text-5xl md:text-[72px] leading-[1.1] tracking-tight text-white mb-8">
            FIND YOUR<br />
            <span class="text-primary">SIGNATURE SOUND</span>
          </h1>
          <div class="relative max-w-[650px] mx-auto lg:mx-0">
            <BaseSearchbar
              v-model="searchPhrase"
              @search="handleSearch"
              placeholder="What are you looking for?"
              container-class="w-full py-2 px-6 bg-grey border border-midGrey rounded-xl text-lg shadow-md transition focus-within:border-primary focus-within:shadow-glow"
              input-class="bg-transparent text-white placeholder-textLightGrey w-full outline-none font-primary"
              :show-button="true"
              button-class="py-8"
            />
          </div>
        </div>
        <div class="flex-[0.8] flex justify-center lg:justify-end w-full">
          <div class="big-logo-text font-secondary select-none">WavsMarket</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 
   We define a custom shadow utility class here for the specific glow 
   since Tailwind's default shadow utilities are black.
   We use color-mix to get an RGBA-like transparency using the CSS variable.
*/
.focus-within\:shadow-glow:focus-within {
  box-shadow: 0 0 25px color-mix(in srgb, var(--primary), transparent 80%);
}

/* Fallback for browsers not supporting color-mix (though most do) */
@supports not (color: color-mix(in srgb, white, black)) {
  .focus-within\:shadow-glow:focus-within {
    box-shadow: 0 0 25px var(--primary);
  }
}

.big-logo-text {
  font-size: 4rem; /* Mobile Size */
  color: #ffffff;
  line-height: 0.85;
  /* Using the global variable for the text shadow color */
  text-shadow: 5px 5px 0px var(--darkPrimary);
  text-align: center;
}

@media (min-width: 1024px) {
  .big-logo-text {
    font-size: 5.5rem; /* Desktop Size */
    text-align: right;
  }
}
</style>