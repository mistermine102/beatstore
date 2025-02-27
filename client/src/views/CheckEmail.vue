<template>
  <div class="mx-auto flex flex-col items-center">
    <h1 class="text-[40px] mt-16">Verify your account</h1>
    <svg class="w-[96px] mx-auto mb-4 text-textLightGrey" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M4 4h18v10h-2V6H4v12h8v2H2V4h2zm4 4H6v2h2v2h2v2h4v-2h2v-2h2V8h-2v2h-2v2h-4v-2H8V8zm6 10h2v2h-2v-2zm4 2v2h-2v-2h2zm2-2h-2v2h2v-2zm0 0v-2h2v2h-2z"
        fill="currentColor"
      />
    </svg>
    <p class="text-[24px]">Please check your email to verify your account.</p>
    <p class="text-[24px] mb-8">The verification link will expire in 1 hour.</p>
    <router-link to="/login" class="base-btn w-fit px-16">Got it</router-link>
  </div>
</template>
