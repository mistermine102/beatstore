<script setup lang="ts">
import { reactive, ref } from 'vue'
import UploadFileContainer from '../components/UploadFileContainer.vue'
import BaseButton from '../components/base/BaseButton.vue'
import { UploadIcon, ImageIcon } from '../components/icons/index.vine'
import useAsyncWrap from '../hooks/useAsyncWrap'
import appApi from '../api/appApi'
import { useToastStore } from '../stores/toast'
import { useRouter } from 'vue-router'

interface NewTrack {
  title: string
  bpm?: string
  key?: string
  genre?: string
  audio?: File | null
  image?: File | null
}

const KEYS = ['A Minor', 'A# Minor', 'B Minor', 'C Minor', 'C# Minor', 'D Minor', 'D# Minor']
const GENRES = ['Trap', 'Drill', 'Boombap', 'Jazz rap', 'Rage', 'R&b']

const wrapUploadTrack = useAsyncWrap()
const toastStore = useToastStore()
const router = useRouter()

const trackType = ref<TrackType>('beat')

const newTrack = reactive<NewTrack>({
  title: '',
  bpm: '',
  key: '',
  genre: '',
  audio: null,
  image: null,
})

function validate() {
  const type: ToastType = 'error'
  const title = "Can't upload"

  if (!newTrack.title) {
    toastStore.show({ type, title, message: 'Title is required' })
    return false
  }

  if (trackType.value === 'beat' || trackType.value === 'sample') {
    //a.k.a playable track, must contain audio
    if (!newTrack.audio) {
      toastStore.show({ type, title, message: 'Audio file is required' })
      return false
    }
  }

  return true
}

function uploadTrack(e: Event) {
  e.preventDefault()
  if (!validate()) return

  wrapUploadTrack.run(async () => {
    switch (trackType.value) {
      case 'beat':
        const { title, bpm, key, genre, audio } = newTrack

        const response = await appApi.postForm<{ newBeat: Beat }>('/beats', {
          title,
          bpm,
          key,
          genre,
          audio,
        })

        await appApi.postForm(`/beats/${response.data.newBeat._id}/image`, {
          image: newTrack.image,
        })
        break
      case 'sample':
        //...
        break
      case 'drumkit':
        //...
        break
    }

    toastStore.show({ type: 'success', title: 'Uploaded succesfully' })
    router.push('/')
  })
}
</script>

<template>
  <div class="mt-16">
    <h1 class="base-heading mb-4">Upload</h1>
    <div class="grid grid-cols-3 gap-x-8">
      <button class="base-btn-alt">Beat</button>
      <button class="base-btn-alt">Sample</button>
      <button class="base-btn-alt">Drum kit</button>
    </div>
    <form @submit="uploadTrack">
      <h2 class="mt-8 mb-2 text-lg">Audio file</h2>
      <UploadFileContainer @file-selected="file => (newTrack.audio = file)" id="audio" max-file-size="25MB" accept="audio/*">
        <template #icon>
          <UploadIcon class="w-[48px]" />
        </template>
      </UploadFileContainer>
      <h2 class="mt-8 mb-2 text-lg">Basic information</h2>
      <div class="grid grid-cols-3 gap-4">
        <input v-model="newTrack.title" id="title" class="base-input w-full" type="text" placeholder="Title" />
        <input v-model="newTrack.bpm" id="bpm" class="base-input w-full" type="text" placeholder="Bpm" />
        <select v-model="newTrack.key" id="key" class="base-input w-full">
          <option v-for="key in KEYS" :value="key">{{ key }}</option>
        </select>
        <select v-model="newTrack.genre" id="genre" class="base-input w-full">
          <option v-for="genre in GENRES" :value="genre">{{ genre }}</option>
        </select>
      </div>
      <h2 class="mt-8 mb-2 text-lg">Image</h2>
      <UploadFileContainer @file-selected="file => (newTrack.image = file)" class="w-1/3" id="image" max-file-size="25MB" accept="image/*">
        <template #icon>
          <ImageIcon class="w-[48px]" />
        </template>
      </UploadFileContainer>
      <div class="w-1/2 mx-auto mt-8">
        <BaseButton :is-loading="wrapUploadTrack.isLoading.value">Upload</BaseButton>
      </div>
    </form>
  </div>
</template>
