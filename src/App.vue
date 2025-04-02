<script setup lang="ts">
// The app component serves as the shell of the application
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact" class="app-bar">
      <v-app-bar-title class="d-flex align-center">
        <v-icon icon="mdi-map-marker-multiple" class="mr-2"></v-icon>
        Passman Planificator
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-cog" @click="$router.push('/settings')"></v-btn>
    </v-app-bar>

    <v-main class="main-content">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.app-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.main-content {
  padding-top: 48px; /* Height of the app bar */
}
</style>
