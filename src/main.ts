import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import 'leaflet/dist/leaflet.css'
import App from './App.vue'
import './style.css'

// Define routes
const routes = [
  {
    path: '/',
    component: () => import('./components/Home.vue')
  },
  {
    path: '/settings',
    component: () => import('./components/Settings.vue')
  }
]

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create the Vuetify instance
const vuetify = createVuetify({
  components,
  directives
})

// Create the app
const app = createApp(App)

// Register plugins
app.use(createPinia())
app.use(router)
app.use(vuetify)

// Mount the app
app.mount('#app')
