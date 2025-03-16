import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./views/Frontpage.vue') },
  // { path: '/search/:phrase', component: () => import('./views/SearchResults.vue') },
  { path: '/signin', component: () => import('./views/Login.vue') },
  { path: '/signup', component: () => import('./views/Register.vue') },
  { path: '/upload', component: () => import('./views/Upload.vue') },
  { path: '/track/:id', component: () => import('./views/SingleTrack.vue') },
  { path: '/profile/:id', component: () => import('./views/SingleProfile.vue') },
  { path: '/liked', component: () => import('./views/Liked.vue') },
  { path: '/profile/:id/edit', component: () => import('./views/EditProfile.vue') },
  { path: '/tracks/browse', component: () => import('./views/TracksBrowser.vue') },
  { path: '/admin', component: () => import('./views/Admin.vue') },
  { path: '/admin/uploads', component: () => import('./views/AdminManageUploads.vue') },
  { path: '/admin/reports', component: () => import('./views/AdminManageReports.vue') },
  { path: '/admin/featured', component: () => import('./views/AdminManageFeaturedProfiles.vue') },
  { path: '/verify-user/success', component: () => import('./views/UserVerified.vue') },
  { path: '/verify-user/link-expired', component: () => import('./views/UserVerifyLinkExpired.vue') },
  { path: '/verify-user/check-email', component: () => import('./views/CheckEmail.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
