import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VineVitePlugin } from 'vue-vine/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('swiper'),
        },
      },
    }),
    VineVitePlugin(),
  ],
  publicDir: 'public', // This is the default value
  build: {
    // If you want to keep the public directory structure:
    assetsDir: 'assets',
    copyPublicDir: true,
  },
})
