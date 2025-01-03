import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAudioPlayerStore = defineStore('audioPlayerStore', () => {
  const track = ref<Track | null>(null)
  const isPaused = ref(false)

  return { track, isPaused }
})
