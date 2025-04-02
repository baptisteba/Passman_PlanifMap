<script setup lang="ts">
// The app component serves as the shell of the application
import MdIcon from './components/MdIcon.vue';
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="3" class="app-bar" density="comfortable">
      <v-app-bar-title class="d-flex align-center">
        <v-avatar class="mr-3 ml-1 app-logo" color="white" rounded>
          <v-icon icon="mdi-map-marker-multiple" color="primary" size="small"></v-icon>
        </v-avatar>
        
        <span class="app-title text-h6">Passman Planificator</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn 
        variant="text" 
        to="/" 
        class="nav-btn"
        :ripple="false"
      >
        <v-icon icon="mdi-map" class="mr-1"></v-icon>
        Carte
      </v-btn>
      <v-btn 
        variant="text" 
        to="/settings" 
        class="nav-btn"
        :ripple="false"
      >
        <v-icon icon="mdi-cog" class="mr-1"></v-icon>
        Paramètres
      </v-btn>
    </v-app-bar>

    <v-main class="main-content bg-surface-variant">
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  backdrop-filter: blur(10px);
}

.app-logo {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.app-logo:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.app-title {
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #fff, #e0e0ff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.nav-btn {
  margin: 0 4px;
  border-radius: 8px;
  height: 40px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-1px);
}

.nav-btn:active {
  transform: translateY(1px);
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: white;
  transition: width 0.2s ease;
  border-radius: 3px 3px 0 0;
}

.nav-btn:hover::after {
  width: 80%;
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Card styling enhancements */
:deep(.v-card) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

:deep(.v-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

/* Button styling enhancements */
:deep(.v-btn) {
  letter-spacing: 0.5px;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.v-btn--elevated) {
  box-shadow: 0 4px 10px rgba(22, 34, 114, 0.15);
}

:deep(.v-btn--elevated:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(22, 34, 114, 0.25);
}

/* Dialog styling enhancements */
:deep(.v-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

/* List item styling */
:deep(.v-list-item) {
  transition: background-color 0.2s ease;
}

:deep(.v-list-item:hover) {
  background-color: rgba(22, 34, 114, 0.05);
}
</style>
