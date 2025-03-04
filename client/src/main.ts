import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

const pinia = createPinia()
const app = createApp(App)

app.use(router)

app.use(VueTippy, {
  defaultProps: {
    theme: 'custom',
    arrow: false,
    animation: 'fade',
    duration: 200,
    offset: [0, 8]
  }
})

app.use(pinia)
app.mount('#app')
