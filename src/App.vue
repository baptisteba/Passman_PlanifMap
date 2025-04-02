<script setup lang="ts">
// The app component serves as the shell of the application
import MdIcon from './components/MdIcon.vue';
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2" class="app-bar">
      <v-app-bar-title class="d-flex align-center">
        <!-- Try v-icon first -->
        <v-icon icon="mdi-map-marker-multiple" class="mr-2"></v-icon>
        
        <!-- Fallback to custom component if the above fails -->
        <MdIcon 
          v-if="false" 
          name="map-marker-multiple" 
          color="white" 
          class="mr-2"
        ></MdIcon>
        
        <span class="app-title">Passman Planificator</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$router.push('/settings')">
        <v-icon icon="mdi-cog"></v-icon>
        
        <!-- Fallback for cog icon -->
        <MdIcon 
          v-if="false" 
          name="cog" 
          color="white"
        ></MdIcon>
      </v-btn>
    </v-app-bar>

    <v-main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: var(--v-background-base, #f5f5f5);
  overflow: hidden; /* Prevent scrollbars on body */
}

html {
  overflow: hidden; /* Prevent scrollbars on html */
}

.app-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.app-title {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.v-app-bar :deep(.v-icon) {
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
  transition: all 0.2s ease;
}

.v-app-bar :deep(.v-btn:hover .v-icon) {
  transform: translateY(-1px);
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
}

.main-content {
  padding-top: 64px; /* Height of the app bar */
  height: calc(100vh - 64px); /* Take up full viewport height minus app bar */
  overflow: hidden; /* Prevent main content from scrolling */
  position: relative; /* Ensure proper positioning context */
}

/* Vuetify overrides */
:deep(.v-toolbar) {
  z-index: auto; /* Prevent toolbar from overlapping other content */
}

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
