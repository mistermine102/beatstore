import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import VueTippy from 'vue-tippy'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(VueTippy)

app.mount('#app')
