<script setup lang="ts">
import { useAudioPlayerStore } from '../../stores/audioPlayer'
import { Volume2Icon, VolumeXIcon } from '../icons/index.vine'
import BaseRangeInput from '../base/BaseRangeInput.vue'
import BasePopover from '../base/BasePopover.vue'

const audioPlayerStore = useAudioPlayerStore()
</script>

<template>
  <div>
    <div class="hidden lg:flex justify-center items-center gap-4">
      <button @click="audioPlayerStore.toggleMute" class="clickable-icon">
        <Volume2Icon v-if="audioPlayerStore.volume" />
        <VolumeXIcon v-else />
      </button>
      <BaseRangeInput :value="audioPlayerStore.volume" @change="audioPlayerStore.setVolume" />
    </div>
    <div class="flex lg:hidden justify-center">
      <BasePopover>
        <template #popover-button>
          <button class="clickable-icon">
            <Volume2Icon v-if="audioPlayerStore.volume" />
            <VolumeXIcon v-else />
          </button>
        </template>
        <template #popover-content>
          <div class="flex justify-center items-center gap-4">
            <button @click="audioPlayerStore.toggleMute" class="clickable-icon">
              <Volume2Icon v-if="audioPlayerStore.volume" />
              <VolumeXIcon v-else />
            </button>
            <BaseRangeInput :value="audioPlayerStore.volume" @change="audioPlayerStore.setVolume" />
          </div>
        </template>
      </BasePopover>
    </div>
  </div>
</template>
