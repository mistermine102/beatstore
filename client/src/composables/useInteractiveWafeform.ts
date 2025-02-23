import { computed } from 'vue'
import { useAudioPlayerStore } from '../stores/audioPlayer'

const useInteractiveWafeform = (track: Track) => {
  const audioPlayerStore = useAudioPlayerStore()

  async function handleWaveformClick(newProgress: number) {
    if (!audioPlayerStore.track || track._id !== audioPlayerStore.track._id) {
      audioPlayerStore.setNewTrack(track as PlayableTrack, { progress: newProgress * 100, isPaused: false })
    } else {
      audioPlayerStore.setProgress(newProgress * 100)
    }
  }

  const waveformProgress = computed(() => {
    return audioPlayerStore.track?._id === track._id ? audioPlayerStore.progress / 100 : 0
  })

  return { handleWaveformClick, waveformProgress }
}

export default useInteractiveWafeform
