<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/* 
  TODO: ARTIST & VIBE CURATION NEEDED
  
  We need to define 4 distinct "Artist Archetypes" to represent specific Vibe combinations (Genre + Mood).
  
  Current Idea Candidates:
  1. "The Emo Rapper" (e.g., Juice WRLD) -> Vibe: Sad Trap / Melodic
  2. "The Drill Sergeant" (e.g., Pop Smoke/Central Cee) -> Vibe: Aggressive Drill / Dark
  3. "The Night Cruiser" (e.g., The Weeknd) -> Vibe: Synthwave / Atmospheric
  4. "The Soul Sampler" (e.g., J Dilla/Griselda) -> Vibe: Boom Bap / Gritty
  
  Action: Find high-quality stock photos representing these artist personas.
*/

const vibes = [
  {
    id: 1,
    title: 'SAD TRAP',
    subtitle: 'Melodic 808s & Emo Rap',
    image: 'https://placehold.co/400x600/111/444?text=Emo+Rapper', // Placeholder
    query: { genre: 'Trap', mood: 'Sad' }
  },
  {
    id: 2,
    title: 'UK DRILL',
    subtitle: 'Sliding Bass & Dark Melodies',
    image: 'https://placehold.co/400x600/111/444?text=Drill+Artist', // Placeholder
    query: { genre: 'Drill', mood: 'Dark' }
  },
  {
    id: 3,
    title: 'LATE NIGHT',
    subtitle: 'Synthwave & R&B Chords',
    image: 'https://placehold.co/400x600/111/444?text=R%26B+Singer', // Placeholder
    query: { genre: 'RnB', mood: 'Atmospheric' }
  },
  {
    id: 4,
    title: 'BOOM BAP',
    subtitle: 'Soul Samples & Gritty Drums',
    image: 'https://placehold.co/400x600/111/444?text=LoFi+Producer', // Placeholder
    query: { genre: 'HipHop', mood: 'Chill' }
  }
]

const handleVibeClick = (query: any) => {
  router.push({ path: '/tracks/browse', query })
}
</script>

<template>
  <section class="py-20 w-full">
    <div class="max-w-[1300px] mx-auto px-6 md:px-8">
      
      <!-- Section Header -->
      <div class="mb-10">
        <h2 class="font-secondary text-5xl mb-2 text-white tracking-wide">SELECT YOUR VIBE</h2>
        <p class="text-textLightGrey text-xl">Find the sound that matches your energy.</p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="vibe in vibes" 
          :key="vibe.id"
          @click="handleVibeClick(vibe.query)"
          class="group relative h-[450px] rounded-xl overflow-hidden border border-midGrey cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-glow hover:-translate-y-2 bg-black"
        >
          
          <!-- Background Image -->
          <img 
            :src="vibe.image" 
            :alt="vibe.title" 
            class="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110"
          />

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80"></div>

          <!-- Content (Bottom) -->
          <div class="absolute bottom-0 left-0 w-full z-10 translate-y-2 transition-transform duration-300 group-hover:translate-y-0 p-4">
            <h3 class="font-black italic text-3xl text-white uppercase leading-none mb-2 tracking-tighter">
              {{ vibe.title }}
            </h3>
            <div class="flex items-center gap-2">
              <p class="text-primary font-semibold tracking-wide uppercase">
                {{ vibe.subtitle }}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Custom utility for the specific shadow glow on hover */
.hover\:shadow-glow:hover {
  box-shadow: 0 10px 30px -10px rgba(247, 101, 184, 0.3);
}
</style>