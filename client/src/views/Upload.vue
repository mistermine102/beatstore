<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import UploadFileContainer from '../components/UploadFileContainer.vue'
import BaseButton from '../components/base/BaseButton.vue'
import { UploadIcon, ImageIcon } from '../components/icons/index.vine'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { useToastStore } from '../stores/toast'
import { useRouter } from 'vue-router'
import { KEYS, GENRES, INSTRUMENTS, MOODS } from '../constants'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseCheckboxSelect from '../components/base/BaseCheckboxSelect.vue'

interface NewTrack {
  title: string
  type: TrackType
  image: File | null
  bpm?: string
  key?: string
  genre?: string
  mood?: string
  instruments?: string[]
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

interface NewLoop extends NewTrack {
  bpm: string
  key: string
  audio: File | null
}

interface NewDrumkit extends NewTrack {}

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
    title: 'Loop',
    type: 'loop' as TrackType,
  },
]

//defining schemas
const NEW_BEAT_SCHEMA: NewBeat = {
  title: '',
  type: 'beat',
  bpm: '',
  key: '',
  mood: '',
  instruments: [],  
  genre: '',
  image: null,
  audio: null,
}

const NEW_SAMPLE_SCHEMA: NewSample = {
  title: '',
  type: 'sample',
  bpm: '',
  key: '',
  mood: '',
  instruments: [],
  image: null,
  audio: null,
}

const NEW_DRUMKIT_SCHEMA: NewDrumkit = {
  title: '',
  type: 'drumkit',
  image: null,
}

const NEW_LOOP_SCHEMA: NewLoop = {
  title: '',
  type: 'loop',
  bpm: '',
  key: '',
  mood: '',
  instruments: [],
  image: null,
  audio: null,
}

//schemas keys are the values of TrackType so we can use dynamic
const SCHEMAS = {
  beat: NEW_BEAT_SCHEMA,
  sample: NEW_SAMPLE_SCHEMA,
  drumkit: NEW_DRUMKIT_SCHEMA,
  loop: NEW_LOOP_SCHEMA,
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

    toastStore.show({ type: 'success', title: 'Upload is waiting for verification!' })
    router.push('/')
  })
}
</script>

<template>
  <div class="mt-16">
    <h1 class="base-heading">Upload</h1>
    <div class="grid grid-cols-3 gap-x-8 gap-y-4">
      <button
        v-for="btn in TRACK_TYPES_BUTTONS"
        :disabled="btn.type === 'drumkit'"
        @click="uploadType = btn.type"
        :class="[btn.type === uploadType ? 'base-btn' : 'base-btn-alt', btn.type === 'drumkit' ? 'opacity-50' : undefined]"
      >
        {{ btn.title }}
      </button>
    </div>
    <form @submit="uploadTrack">
      <!-- if a field exists on schema (isn't undefined) then display it's input -->
      <div v-if="newTrack.audio !== undefined">
        <h2 class="mt-8 mb-2 text-lg">Audio file</h2>
        <UploadFileContainer @file-selected="file => (newTrack.audio = file ? file : null)" id="audio" max-file-size="25MB" accept="audio/*">
          <template #icon>
            <div class="w-[48px]">
              <UploadIcon />
            </div>
          </template>
        </UploadFileContainer>
      </div>
      <h2 class="mt-8 mb-2 text-lg">Basic information</h2>
      <div class="grid grid-cols-3 gap-4">
        <!-- if a field exists on schema (isn't undefined) then display it's input -->
        <input v-if="newTrack.title !== undefined" v-model="newTrack.title" id="title" class="base-input w-full" type="text" placeholder="Title" />
        <input v-if="newTrack.bpm !== undefined" v-model="newTrack.bpm" id="bpm" class="base-input w-full" type="text" placeholder="Bpm" />
        <BaseSelect v-if="newTrack.key !== undefined" v-model="newTrack.key" :options="KEYS.map(k => ({ value: k, label: k }))" placeholder="Key" />
        <BaseSelect
          v-if="newTrack.genre !== undefined"
          v-model="newTrack.genre"
          :options="GENRES.map(g => ({ value: g, label: g }))"
          class="base-input px-0"
          placeholder="Genre"
        />
        <BaseCheckboxSelect
          v-if="newTrack.instruments !== undefined"
          v-model="newTrack.instruments"
          :options="INSTRUMENTS.map(i => ({ value: i, label: i }))"
          placeholder="Instruments"
        />
        <BaseSelect
          v-if="newTrack.mood !== undefined"
          v-model="newTrack.mood"
          :options="MOODS.map(m => ({ value: m, label: m }))"
          class="base-input px-0"
          placeholder="Mood"
        />
      </div>
      <!-- if a field exists on schema (isn't undefined) then display it's input -->
      <div>
        <h2 class="mt-8 mb-2 text-lg">Image</h2>
        <UploadFileContainer
          v-if="newTrack.image !== undefined"
          @file-selected="file => (newTrack.image = file ? file : null)"
          class="w-1/3"
          id="image"
          max-file-size="25MB"
          accept="image/*"
        >
          <template #icon>
            <div class="w-[48px]">
              <ImageIcon />
            </div>
          </template>
        </UploadFileContainer>
      </div>
      <div class="w-1/2 mx-auto mt-8">
        <BaseButton class="w-full" :is-loading="wrapUploadTrack.isLoading">Upload</BaseButton>
      </div>
    </form>
  </div>
</template>
