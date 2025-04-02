<template>
  <div class="intervention-list">
    <v-toolbar density="compact" color="primary" class="intervention-header">
      <v-toolbar-title class="text-subtitle-1">Interventions à planifier</v-toolbar-title>
    </v-toolbar>
    
    <v-list lines="two" class="intervention-items">
      <v-list-item
        v-for="intervention in interventions"
        :key="intervention.id"
        :title="intervention.clientName"
        :subtitle="intervention.address"
        :active="selectedIntervention?.id === intervention.id"
        @click="selectIntervention(intervention.id)"
        class="intervention-item"
      >
        <template v-slot:prepend>
          <v-icon :icon="getStatusIcon(intervention.status)" 
                 :color="getStatusColor(intervention.status)"
                 class="status-icon"></v-icon>
                 
          <MdIcon 
            v-if="false"
            :name="getStatusIcon(intervention.status).replace('mdi-', '')" 
            :color="getStatusColor(intervention.status)"
            class="status-icon"
          ></MdIcon>
        </template>
        
        <template v-slot:append>
          <v-icon icon="mdi-map-marker" 
                 color="primary"
                 class="location-icon"></v-icon>
                 
          <MdIcon 
            v-if="false"
            name="map-marker" 
            color="primary"
            class="location-icon"
          ></MdIcon>
        </template>
      </v-list-item>
    </v-list>

    <div v-if="interventions.length === 0" class="no-interventions">
      <v-alert type="info" class="ma-3">Aucune intervention à planifier</v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useInterventionStore } from '../stores/interventions'
import MdIcon from './MdIcon.vue'

// Define emits
const emit = defineEmits<{
  'selectIntervention': [id: string]
}>()

// Store access
const interventionStore = useInterventionStore()

// Computed properties
const interventions = computed(() => interventionStore.interventions)
const selectedIntervention = computed(() => interventionStore.selectedIntervention)

// Get the appropriate icon for the intervention status
function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return 'mdi-clock-outline'
    case 'assigned': return 'mdi-account-check'
    case 'completed': return 'mdi-check-circle'
    default: return 'mdi-help-circle'
  }
}

// Get the appropriate color for the intervention status
function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'warning'
    case 'assigned': return 'info'
    case 'completed': return 'success'
    default: return 'grey'
  }
}

// Method to select an intervention
function selectIntervention(id: string) {
  emit('selectIntervention', id)
}
</script>

<style scoped>
.intervention-list {
  display: flex;
  flex-direction: column;
  height: 60%;
  overflow-y: auto;
  background-color: white;
}

.intervention-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.intervention-items {
  flex-grow: 1;
  overflow-y: auto;
}

.intervention-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
  padding: 8px 0;
}

.no-interventions {
  padding: 1rem;
}

.status-icon, .location-icon {
  opacity: 0.85;
  transition: all 0.2s ease;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

.location-icon {
  color: #1976D2 !important;
  transform-origin: center bottom;
}

/* Make the list items more interactive */
:deep(.v-list-item--active) {
  background-color: rgba(25, 118, 210, 0.12); /* Primary color with low opacity */
}

:deep(.v-list-item:hover) {
  background-color: rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

:deep(.v-list-item:hover .status-icon),
:deep(.v-list-item:hover .location-icon) {
  opacity: 1;
  transform: translateY(-1px);
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
}
</style> 