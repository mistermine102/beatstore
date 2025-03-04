<script setup lang="ts">
import { ref } from 'vue'
import appApi from '../api/appApi'
import useAsyncWrap from '../composables/useAsyncWrap'
import BaseButton from '../components/base/BaseButton.vue'
import EmptyState from '../components/EmptyState.vue'

interface Report {
  _id: string
  track: {
    _id: string
    title: string
  }
  reporter: {
    _id: string
    username: string
  }
  message: string
  status: 'pending' | 'resolved' | 'rejected'
  createdAt: string
}

const reports = ref<Report[]>([])
const wrapGetReports = useAsyncWrap()
const wrapUpdateReport = useAsyncWrap()

function getReports() {
  wrapGetReports.run(async () => {
    const response = await appApi.get<{ reports: Report[] }>('/reports')
    reports.value = response.data.reports
  })
}

async function updateReportStatus(reportId: string, status: 'resolved' | 'rejected') {
  wrapUpdateReport.run(async () => {
    await appApi.patch(`/reports/${reportId}`, { status })
    getReports()
  })
}

getReports()
</script>

<template>
  <div>
    <h1 class="base-heading">Manage Reports</h1>
    <div v-if="wrapGetReports.isLoading.value" class="flex justify-center">
      <div class="loader"></div>
    </div>
    <div v-else-if="!reports.length" class="w-full">
      <EmptyState />
    </div>
    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="report in reports" :key="report._id" class="base-container p-8">
        <div class="flex gap-8">
          <div class="min-w-[200px]">
            <h3 class="text-xl mb-1">{{ report.track.title }}</h3>
            <p class="text-gray-400">Reported by {{ report.reporter.username }}</p>
            <p class="text-gray-400">{{ new Date(report.createdAt).toLocaleDateString() }}</p>
          </div>
          
          <div class="flex-1 bg-darkGrey p-4 rounded-sm">
            <p class="text-gray-300">Report message:</p>
            <p class="mt-1 break-words">{{ report.message }}</p>
          </div>

          <div class="flex flex-col items-end gap-4 min-w-[140px]">
            <div v-if="report.status === 'pending'" class="flex flex-col gap-2">
              <BaseButton
                class="w-32"
                @click="updateReportStatus(report._id, 'resolved')"
                :is-loading="wrapUpdateReport.isLoading.value"
              >
                Resolve
              </BaseButton>
              <BaseButton
                class="w-32"
                alt
                @click="updateReportStatus(report._id, 'rejected')"
                :is-loading="wrapUpdateReport.isLoading.value"
              >
                Reject
              </BaseButton>
            </div>
            <span 
              v-else 
              :class="{
                'text-green-500': report.status === 'resolved',
                'text-red-500': report.status === 'rejected'
              }"
              class="px-3 py-1 rounded-sm border"
            >
              {{ report.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 