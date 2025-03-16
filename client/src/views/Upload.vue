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
  description: string
  image: File | null
  bpm?: string
  key?: string
  genre?: string
  mood?: string
  instruments?: string[]
  audio?: File | null
  licenseId: string | null
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
  description: '',
  bpm: '',
  key: '',
  mood: '',
  instruments: [],
  genre: '',
  image: null,
  audio: null,
  licenseId: null,
}

const NEW_SAMPLE_SCHEMA: NewSample = {
  title: '',
  type: 'sample',
  description: '',
  bpm: '',
  key: '',
  mood: '',
  instruments: [],
  image: null,
  audio: null,
  licenseId: null,
}

const NEW_DRUMKIT_SCHEMA: NewDrumkit = {
  title: '',
  type: 'drumkit',
  description: '',
  image: null,
  licenseId: null,
}

const NEW_LOOP_SCHEMA: NewLoop = {
  title: '',
  type: 'loop',
  description: '',
  bpm: '',
  key: '',
  mood: '',
  instruments: [],
  image: null,
  audio: null,
  licenseId: null,
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

  if (newTrack.value.audio !== undefined) {
    //playable track, must contain audio
    if (!newTrack.value.audio) {
      toastStore.show({ type, title, message: 'Audio file is required' })
      return false
    }

    //validate if audio file isn't larger than max size
    const maxSizeInBytes = 50 * 1024 * 1024 // 50MB in bytes
    if (newTrack.value.audio && newTrack.value.audio.size > maxSizeInBytes) {
      toastStore.show({
        type,
        title,
        message: `Audio file is too large. Maximum size is ${(maxSizeInBytes / (1024 * 1024)).toFixed(0)}MB.`,
      })
      return false
    }
  }

  if (!newTrack.value.licenseId) {
    toastStore.show({ type, title, message: 'Terms are required' })
    return false
  }

  if (newTrack.value.title.length < 4) {
    toastStore.show({ type, title, message: 'Title must be at least 4 characters long' })
    return false
  }

  if (newTrack.value.description.length > 500) {
    toastStore.show({ type, title, message: 'Description must be less than 500 characters' })
    return false
  }

  return true
}

function uploadTrack(e: Event) {
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

//licenses
const licenses = ref<License[]>([])

const wrapGetLicenses = useAsyncWrap()

function getLicenses() {
  wrapGetLicenses.run(async () => {
    const response = await appApi.get('/licenses')
    licenses.value = response.data.licenses
  })
}

getLicenses()
</script>

<template>
  <div class="">
    <div class="panel mb-8">
      <h1 class="text-4xl font-secondary mb-4">Upload</h1>
      <p class="text-textLightGrey">Choose the type</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <BaseButton
          v-for="btn in TRACK_TYPES_BUTTONS"
          :key="btn.type"
          @click="uploadType = btn.type"
          :alt="btn.type !== uploadType"
          :disabled="btn.type === 'drumkit'"
          :class="['h-24 w-full', btn.type === 'drumkit' ? 'opacity-50' : undefined, uploadType === btn.type ? 'hover:bg-primary' : '']"
        >
          <div class="w-full flex sm:flex-col gap-x-2 items-center">
            <UploadIcon :size="32" class="hidden sm:block" />
            <UploadIcon class="block sm:hidden" />
            <span class="text-lg">{{ btn.title }}</span>
          </div>
        </BaseButton>
      </div>
    </div>

    <form @submit="uploadTrack">
      <div class="grid grid-cols-3 gap-8">
        <!-- Audio Upload Panel -->
        <div v-if="newTrack.audio !== undefined" class="panel col-span-3 lg:col-span-2">
          <h2 class="text-2xl mb-4">Audio File</h2>
          <UploadFileContainer
            @file-selected="file => (newTrack.audio = file ? file : null)"
            id="audio"
            max-file-size="50MB"
            accept="audio/*"
            class="border-2 border-dashed border-white/[0.1] hover:border-primary transition-colors duration-150"
          >
            <template #icon>
              <UploadIcon :size="48" />
            </template>
          </UploadFileContainer>
        </div>
        <div class="col-span-3 lg:col-span-1 panel">
          <h2 class="text-2xl mb-4">Cover Image</h2>
          <UploadFileContainer
            v-if="newTrack.image !== undefined"
            @file-selected="file => (newTrack.image = file ? file : null)"
            class="border-2 border-dashed border-white/[0.1] hover:border-primary transition-colors duration-150"
            accept="image/*"
            max-file-size="25MB"
            id="image"
          >
            <template #icon>
              <ImageIcon :size="48" />
            </template>
          </UploadFileContainer>
        </div>

        <div class="panel col-span-3">
          <h2 class="text-2xl mb-6">Terms</h2>
          <BaseSelect
            v-model="newTrack.licenseId"
            :options="licenses.map(l => ({ value: l._id, label: l.title }))"
            class="[&>.popover-button]:bg-background"
            placeholder="Select terms"
          />
          <div v-if="newTrack.licenseId !== null">
            <p class="text-lg mt-4">{{ licenses.find(l => l._id === newTrack.licenseId)?.shortDescription }}</p>
            <p class="mt-2 text-textLightGrey">{{ licenses.find(l => l._id === newTrack.licenseId)?.longDescription }}</p>
          </div>
        </div>

        <!-- Basic Information Panel -->
        <div class="panel col-span-3">
          <h2 class="text-2xl mb-6">Basic Information</h2>
          <div class="grid grid-cols-2 gap-4">
            <input
              v-if="newTrack.title !== undefined"
              v-model="newTrack.title"
              id="title"
              class="base-input bg-background col-span-2"
              type="text"
              placeholder="Title"
            />
            <input
              v-if="newTrack.bpm !== undefined"
              v-model="newTrack.bpm"
              id="bpm"
              class="base-input w-full bg-background"
              type="text"
              placeholder="BPM"
            />
            <BaseSelect
              v-if="newTrack.key !== undefined"
              v-model="newTrack.key"
              :options="KEYS.map(k => ({ value: k, label: k }))"
              placeholder="Key"
              class="[&>.popover-button]:bg-background"
            />
            <BaseSelect
              v-if="newTrack.genre !== undefined"
              v-model="newTrack.genre"
              :options="GENRES.map(g => ({ value: g, label: g }))"
              placeholder="Genre"
              class="col-span-2 [&>.popover-button]:bg-background"
            />
            <BaseSelect
              v-if="newTrack.mood !== undefined"
              v-model="newTrack.mood"
              :options="MOODS.map(m => ({ value: m, label: m }))"
              placeholder="Mood"
              class="col-span-2 bg-background [&>.popover-button]:bg-background"
            />
            <BaseCheckboxSelect
              v-if="newTrack.instruments !== undefined"
              v-model="newTrack.instruments"
              :options="INSTRUMENTS.map(i => ({ value: i, label: i }))"
              placeholder="Select instruments"
              class="col-span-2 [&>.popover-button]:bg-background"
            />
          </div>
        </div>
        <div class="panel col-span-3">
          <h2 class="text-2xl mb-4">Description</h2>
          <textarea
            v-model="newTrack.description"
            class="base-input bg-background w-full h-32 resize-none"
            placeholder="Describe your upload (max 500 characters)"
            maxlength="500"
          ></textarea>
        </div>
      </div>
      <BaseButton type="submit" :is-loading="wrapUploadTrack.isLoading" class="mt-8 w-full sm:w-1/2 mx-auto">
        <div class="flex items-center justify-center gap-2">
          <UploadIcon :size="20" />
          <span>Upload</span>
        </div>
      </BaseButton>
    </form>
  </div>
</template>
