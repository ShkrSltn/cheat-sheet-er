import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Toast, {
  position: 'bottom-right',
  timeout: 1500,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: false,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: false,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  maxToasts: 2,
  newestOnTop: true,
})

// Initialize authentication before mounting
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.mount('#app')
})
