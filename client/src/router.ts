import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./views/Frontpage.vue') },
  { path: '/login', component: () => import('./views/Login.vue') },
  { path: '/register', component: () => import('./views/Register.vue') },
  { path: '/upload', component: () => import('./views/Upload.vue') },
  { path: '/track/:type/:id', component: () => import('./views/SingleTrack.vue') },
  { path: '/profile/:id', component: () => import('./views/Profile.vue') },
  // { path: '/profile/:id/edit', component: () => import('./views/EditProfile.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
