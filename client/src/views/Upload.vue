<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import UploadFileContainer from '../components/UploadFileContainer.vue'
import BaseButton from '../components/base/BaseButton.vue'
import { UploadIcon, ImageIcon } from '../components/icons/index.vine'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { useToastStore } from '../stores/toast'
import { useRouter } from 'vue-router'

interface NewTrack {
  title: string
  type: TrackType
  image: File | null
  bpm?: string
  key?: string
  genre?: string
  audio?: File | null
}

interface NewBeat extends NewTrack {
  bpm: string
  key: string
  genre: string
  audio: File | null
}

interface NewSample extends NewTrack {
  bpm: string
  key: string
  audio: File | null
}

interface NewDrumkit extends NewTrack {}

//defining constants
const KEYS = ['A Minor', 'A# Minor', 'B Minor', 'C Minor', 'C# Minor', 'D Minor', 'D# Minor']
const GENRES = ['Trap', 'Drill', 'Boombap', 'Jazz rap', 'Rage', 'R&b']

const TRACK_TYPES_BUTTONS = [
  {
    title: 'Beat',
    type: 'beat' as TrackType,
  },
  {
    title: 'Sample',
    type: 'sample' as TrackType,
  },
  {
    title: 'Drumkit',
    type: 'drumkit' as TrackType,
  },
]

//defining schemas
const NEW_BEAT_SCHEMA: NewBeat = {
  title: '',
  type: 'beat',
  bpm: '',
  key: '',
  genre: '',
  image: null,
  audio: null,
}

const NEW_DRUMKIT_SCHEMA: NewDrumkit = {
  title: '',
  type: 'drumkit',
  image: null,
}

const NEW_SAMPLE_SCHEMA: NewSample = {
  title: '',
  type: 'sample',
  bpm: '',
  key: '',
  image: null,
  audio: null,
}

//schemas keys are the values of TrackType so we can use dynamic
const SCHEMAS = {
  beat: NEW_BEAT_SCHEMA,
  sample: NEW_SAMPLE_SCHEMA,
  drumkit: NEW_DRUMKIT_SCHEMA,
}

const wrapUploadTrack = reactive(useAsyncWrap())
const toastStore = useToastStore()
const router = useRouter()

const uploadType = ref<TrackType>('beat')

//create new track based on a given schema (beat schema is just a starting value)
//if a schema doesn't contain a certain value it will not be displayed in the template because it will be undefined
const newTrack = ref<NewTrack>(NEW_BEAT_SCHEMA)

//update new track when upload type changes
watch(uploadType, () => {
  //find schema of a selected upload type and assign it
  newTrack.value = SCHEMAS[uploadType.value as keyof typeof SCHEMAS]
})

function validate() {
  const type: ToastType = 'error'
  const title = "Can't upload"

  if (newTrack.value.title.length < 4) {
    toastStore.show({ type, title, message: 'Title must be at least 4 characters long' })
    return false
  }

  if (newTrack.value.audio !== undefined) {
    //playable track, must contain audio
    if (!newTrack.value.audio) {
      toastStore.show({ type, title, message: 'Audio file is required' })
      return false
    }
  }

  return true
}

function uploadTrack(e: Event) {
  console.log(newTrack.value)
  e.preventDefault()
  if (!validate()) return

  wrapUploadTrack.run(async () => {
    //set image field to null so backend doesn't complain it got an unexpected field (issue only with file fields)
    const response = await appApi.postForm<{ trackId: string }>('/tracks', {
      ...newTrack.value,
      image: null,
    })

    if (newTrack.value.image) {
      await appApi.postForm(`tracks/${response.data.trackId}/image`, {
        image: newTrack.value.image,
      })
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
      <button v-for="btn in TRACK_TYPES_BUTTONS" @click="uploadType = btn.type" :class="btn.type === uploadType ? 'base-btn' : 'base-btn-alt'">
        {{ btn.title }}
      </button>
    </div>
    <form @submit="uploadTrack">
      <!-- if a field exists on schema (isn't undefined) then display it's input -->
      <div v-if="newTrack.audio !== undefined">
        <h2 class="mt-8 mb-2 text-lg">Audio file</h2>
        <UploadFileContainer @file-selected="(file) => newTrack.audio = file" id="audio" max-file-size="25MB" accept="audio/*">
          <template #icon>
            <UploadIcon class="w-[48px]" />
          </template>
        </UploadFileContainer>
      </div>
      <h2 class="mt-8 mb-2 text-lg">Basic information</h2>
      <div class="grid grid-cols-3 gap-4">
        <!-- if a field exists on schema (isn't undefined) then display it's input -->
        <input v-if="newTrack.title !== undefined" v-model="newTrack.title" id="title" class="base-input w-full" type="text" placeholder="Title" />
        <input v-if="newTrack.bpm !== undefined" v-model="newTrack.bpm" id="bpm" class="base-input w-full" type="text" placeholder="Bpm" />
        <select v-if="newTrack.key !== undefined" v-model="newTrack.key" id="key" class="base-input w-full">
          <option v-for="key in KEYS" :value="key">{{ key }}</option>
        </select>
        <select v-if="newTrack.genre !== undefined" v-model="newTrack.genre" id="genre" class="base-input w-full">
          <option v-for="genre in GENRES" :value="genre">{{ genre }}</option>
        </select>
      </div>
      <!-- if a field exists on schema (isn't undefined) then display it's input -->
      <div>
        <h2 class="mt-8 mb-2 text-lg">Image</h2>
        <UploadFileContainer
          v-if="newTrack.image !== undefined"
          @file-selected="file => (newTrack.image = file)"
          class="w-1/3"
          id="image"
          max-file-size="25MB"
          accept="image/*"
        >
          <template #icon>
            <ImageIcon class="w-[48px]" />
          </template>
        </UploadFileContainer>
      </div>
      <div class="w-1/2 mx-auto mt-8">
        <BaseButton :is-loading="wrapUploadTrack.isLoading">Upload</BaseButton>
      </div>
    </form>
  </div>
</template>
