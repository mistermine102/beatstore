import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from './stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./views/Frontpage.vue'),
  },
  {
    path: '/signin',
    component: () => import('./views/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/signup',
    component: () => import('./views/Register.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/upload',
    component: () => import('./views/Upload.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/track/:id',
    component: () => import('./views/SingleTrack.vue'),
  },
  {
    path: '/profile/:id',
    component: () => import('./views/SingleProfile.vue'),
  },
  {
    path: '/liked',
    component: () => import('./views/Liked.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:id/edit',
    component: () => import('./views/EditProfile.vue'),
    meta: { requiresAuth: true, ownerOnly: true },
  },
  {
    path: '/tracks/browse',
    component: () => import('./views/TracksBrowser.vue'),
  },
  {
    path: '/admin',
    component: () => import('./views/Admin.vue'),
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/admin/uploads',
    component: () => import('./views/AdminManageUploads.vue'),
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/admin/reports',
    component: () => import('./views/AdminManageReports.vue'),
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/admin/featured',
    component: () => import('./views/AdminManageFeaturedProfiles.vue'),
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/verify-user/success',
    component: () => import('./views/UserVerified.vue'),
  },
  {
    path: '/verify-user/link-expired',
    component: () => import('./views/UserVerifyLinkExpired.vue'),
  },
  {
    path: '/verify-user/check-email',
    component: () => import('./views/CheckEmail.vue'),
  },
  {
    path: '/reset-password',
    component: () => import('./views/ResetPassword.vue'),
  },
  {
    path: '/terms',
    component: () => import('./views/Terms.vue'),
  },
  {
    path: '/privacy-policy',
    component: () => import('./views/PrivacyPolicy.vue'),
  },
  // Add a catch-all 404 route
  {
    path: '/:pathMatch(.*)*',
    component: () => import('./views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (authStore.user === undefined) {
    await authStore.localLogin()
  }

  const isAuthenticated = !!authStore.user
  const isAdmin = authStore.user && authStore.user.roles.includes('admin')

  // If not authenticated but authentication is required
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login page with redirect path
    return next({
      path: '/signin',
      query: { redirect: to.fullPath },
    })
  }

  // If authenticated but page is for guests only
  if (to.meta.guestOnly && isAuthenticated) return next('/')

  // If admin access required but user is not admin
  if (to.meta.adminOnly && !isAdmin) return next('/')

  // If all checks pass, proceed with navigation
  next()
})

export default router
