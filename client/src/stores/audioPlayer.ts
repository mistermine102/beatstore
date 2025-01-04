import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAudioPlayerStore = defineStore('audioPlayerStore', () => {
  const track = ref<PlayableTrack | null>(null)
  const audio = ref(new Audio())
  const progress = ref(0)
  const volume = ref(50)
  const volumeBeforeMute = ref(0)
  const isPaused = ref(false)
  const isScrubbing = ref(false)
  const duration = ref(0)
  const currentTime = ref(0)

  async function toggle() {
    audio.value.paused ? audio.value.play() : audio.value.pause()
  }

  function setNewTrack(newTrack: PlayableTrack) {
    //set new track as the one currently playing
    track.value = newTrack

    //set listeners
    audio.value.onloadeddata = () => {
      // set duration when audio is loaded
      duration.value = audio.value.duration
    }

    audio.value.ontimeupdate = () => {
      if (isNaN(audio.value.duration)) {
        //if duration is NaN that means audio hasn't been loaded yet
        //thus we reset both values (rather than setting progress to NaN)
        //if we let ontimeupdate listener update progress we experience a lag for as long as audio is being loaded
        currentTime.value = 0
        progress.value = 0
        return
      }

      progress.value = (audio.value.currentTime / audio.value.duration) * 100
      currentTime.value = audio.value.currentTime
    }

    audio.value.onplay = () => {
      isPaused.value = false
    }

    audio.value.onpause = () => {
      //don't inform the template about pausing when scrubbing
      if (isScrubbing.value) return
      isPaused.value = true
    }

    //change source
    audio.value.src = newTrack.audio.url
    setVolume(volume.value)
  }

  function setVolume(newVolume: number) {
    //update state variable
    volume.value = newVolume

    //update audio volume
    //audio volume needs to be in range 0 to 1
    //power to scale volume quadraticly (volume 50 on slider should actually be 0.25)
    audio.value.volume = Math.pow(newVolume, 2) / 10000
  }

  function toggleMute() {
    if (volume.value) {
      volumeBeforeMute.value = volume.value
      setVolume(0)
    } else {
      setVolume(volumeBeforeMute.value)
    }
  }

  function setProgress(newProgress: number) {
    //updating progress on progress bar before ontimeupdate listener updates it prevents progress bar from stuttering
    progress.value = newProgress

    //update audio progress
    const newCurrentTime = (newProgress / 100) * audio.value.duration
    audio.value.currentTime = newCurrentTime

    // pause for a little bit to prevent stutters
    if (!audio.value.paused) {
      isScrubbing.value = true
      toggle()
      setTimeout(async () => {
        isScrubbing.value = false
        toggle()
      }, 300)
    }
  }

  return { track, isPaused, audio, duration, currentTime, progress, volume, toggle, setNewTrack, setVolume, toggleMute, setProgress }
})
