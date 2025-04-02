import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Import Material Design Icons
import 'vuetify/styles'
import 'leaflet/dist/leaflet.css'
import App from './App.vue'
import './style.css'
import { registerCustomIcons } from './assets/icons'

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

// Create the Vuetify instance with custom theme
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#162272',   // Deep blue
          secondary: '#424242', // Dark gray
          accent: '#FF4081',    // Pink
          info: '#2196F3',      // Light blue
          warning: '#FFC107',   // Amber
          error: '#FF5252',     // Red
          success: '#4CAF50',   // Green
          background: '#F5F5F5' // Light gray background
        }
      }
    }
  }
})

// Register custom icons
registerCustomIcons(vuetify)

// Create the app
const app = createApp(App)

// Register plugins
app.use(createPinia())
app.use(router)
app.use(vuetify)

// Mount the app
app.mount('#app')
