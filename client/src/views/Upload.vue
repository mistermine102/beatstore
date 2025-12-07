<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import UploadFileContainer from '../components/UploadFileContainer.vue'
import BaseButton from '../components/base/BaseButton.vue'
import { UploadIcon, ImageIcon } from '../components/icons/index.vine'
import useAsyncWrap from '../composables/useAsyncWrap'
import appApi from '../api/appApi'
import { useToastStore } from '../stores/toast'
import { useRouter } from 'vue-router'
import { KEYS, GENRES, INSTRUMENTS, MOODS, GENERIC_ERROR_TOAST } from '../constants'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseCheckboxSelect from '../components/base/BaseCheckboxSelect.vue'

interface Tier {
  licenseId: string
  price: string
}

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
  pricingType?: 'free' | 'paid'
  sellThrough?: 'platform' | 'external'
  freeDownloadPolicy: 'unavailable' | 'direct'
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
  freeDownloadPolicy: 'unavailable',
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
  freeDownloadPolicy: 'unavailable',
}

const NEW_DRUMKIT_SCHEMA: NewDrumkit = {
  title: '',
  type: 'drumkit',
  description: '',
  image: null,
  freeDownloadPolicy: 'unavailable',
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
  freeDownloadPolicy: 'unavailable',
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

  if (newTrack.value.title.length < 4) {
    toastStore.show({ type, title, message: 'Title must be at least 4 characters long' })
    return false
  }

  if (newTrack.value.title.length > 100) {
    toastStore.show({ type, title, message: 'Title must be less than 100 characters' })
    return false
  }

  if (newTrack.value.bpm && (parseInt(newTrack.value.bpm) > 999 || parseInt(newTrack.value.bpm) < 0)) {
    toastStore.show({ type, title, message: 'Bpm must between 0 and 999' })
    return false
  }

  if (newTrack.value.description.length > 500) {
    toastStore.show({ type, title, message: 'Description must be less than 500 characters' })
    return false
  }

  if (!newTrack.value.pricingType) {
    toastStore.show({ type, title, message: 'Pricing type (Free/Paid) is required' })
    return false
  }

  if (newTrack.value.pricingType === 'paid') {
    if (!newTrack.value.sellThrough) {
      toastStore.show({ type, title, message: 'Please select how you want to sell' })
      return false
    }

    if (newTrack.value.sellThrough === 'platform') {
      if (tiers.value.length === 0) {
        toastStore.show({ type, title, message: 'Select at least one license tier' })
        return false
      }

      for (const tier of tiers.value) {
        const price = parseFloat(tier.price)
        if (!tier.price || isNaN(price) || price <= 0) {
          const licenseTitle = licenses.value.find(l => l._id === tier.licenseId)?.title || 'tier'
          toastStore.show({ type, title, message: `Enter a valid price for ${licenseTitle}` })
          return false
        }
      }
    }
  }

  return true
}

function uploadTrack(e: Event) {
  e.preventDefault()
  if (!validate()) return

  wrapUploadTrack.run(
    async () => {
      const trackData: Record<string, unknown> = {
        ...newTrack.value,
        image: null,
      }

      // Add tiers with prices converted to cents for platform purchases
      if (trackData.pricingType === 'paid' && trackData.sellThrough === 'platform') {
        trackData.tiers = tiers.value.map(t => ({
          licenseId: t.licenseId,
          price: Math.round(parseFloat(t.price) * 100),
        }))
      }

      //set image field to null so backend doesn't complain it got an unexpected field (issue only with file fields)
      const response = await appApi.postForm<{ trackId: string }>('/tracks', trackData)

      if (newTrack.value.image) {
        await appApi.postForm(`tracks/${response.data.trackId}/image`, {
          image: newTrack.value.image,
        })
      }

      toastStore.show({ type: 'success', title: 'Upload is waiting for verification!' })
      router.push('/')
    },
    err => {
      if (err.response.data.message === 'TITLE_NOT_AVAILABLE')
        return toastStore.show({ type: 'error', title: "Can't upload", message: 'Title not available' })
      return toastStore.show(GENERIC_ERROR_TOAST)
    }
  )
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

// Tiers for pricing
const tiers = ref<Tier[]>([])

function isTierSelected(licenseId: string): boolean {
  return tiers.value.some(t => t.licenseId === licenseId)
}

function getTier(licenseId: string): Tier | undefined {
  return tiers.value.find(t => t.licenseId === licenseId)
}

function toggleTier(licenseId: string) {
  const index = tiers.value.findIndex(t => t.licenseId === licenseId)
  if (index === -1) {
    tiers.value.push({ licenseId, price: '' })
  } else {
    tiers.value.splice(index, 1)
  }
}
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
              type="number"
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

        <!-- Pricing Panel -->
        <div class="panel col-span-3">
          <h2 class="text-2xl mb-6">Pricing</h2>

          <!-- Free/Paid Selection -->
          <div class="mb-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseButton
                type="button"
                @click="newTrack.pricingType = 'free'"
                :alt="newTrack.pricingType !== 'free'"
                :class="['h-24 w-full', newTrack.pricingType === 'free' ? 'hover:bg-primary' : '']"
              >
                <span class="text-lg">Free</span>
              </BaseButton>
              <BaseButton
                type="button"
                @click="newTrack.pricingType = 'paid'"
                :alt="newTrack.pricingType !== 'paid'"
                :class="['h-24 w-full', newTrack.pricingType === 'paid' ? 'hover:bg-primary' : '']"
              >
                <span class="text-lg">Paid</span>
              </BaseButton>
            </div>
          </div>

          <!-- How to Sell Selection (Only show if Paid) -->
          <div v-if="newTrack.pricingType === 'paid'" class="mb-8">
            <p class="text-lg mb-4">How do you want to sell?</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseButton
                type="button"
                @click="newTrack.sellThrough = 'platform'"
                :alt="newTrack.sellThrough !== 'platform'"
                :class="['h-24 w-full', newTrack.sellThrough === 'platform' ? 'hover:bg-primary' : '']"
              >
                <span class="text-lg">Through WavsMarket</span>
              </BaseButton>
              <BaseButton
                type="button"
                @click="newTrack.sellThrough = 'external'"
                :alt="newTrack.sellThrough !== 'external'"
                :class="['h-24 w-full', newTrack.sellThrough === 'external' ? 'hover:bg-primary' : '']"
              >
                <span class="text-lg">Outside the platform</span>
              </BaseButton>
            </div>
          </div>

          <!-- License Tiers (Only show if Through Platform) -->
          <div v-if="newTrack.pricingType === 'paid' && newTrack.sellThrough === 'platform'">
            <p class="text-lg mb-4">Select license tiers and set prices</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                v-for="license in licenses"
                :key="license._id"
                @click="toggleTier(license._id)"
                :class="[
                  'p-4 rounded-regular cursor-pointer transition-all border',
                  isTierSelected(license._id) ? 'bg-primary/10 border-primary' : 'bg-darkGrey border-white/[0.1] hover:border-white/[0.3]',
                ]"
              >
                <p class="text-lg font-medium mb-2">{{ license.title }}</p>
                <input
                  :value="getTier(license._id)?.price || ''"
                  @input="e => { const t = getTier(license._id); if (t) t.price = (e.target as HTMLInputElement).value }"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Price in USD"
                  :disabled="!isTierSelected(license._id)"
                  :class="['base-input bg-background w-full', !isTierSelected(license._id) && 'opacity-50 cursor-not-allowed']"
                  @click.stop
                />
              </div>
            </div>
          </div>
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
