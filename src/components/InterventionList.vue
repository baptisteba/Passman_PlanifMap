<template>
  <div class="intervention-list">
    <v-toolbar density="compact" color="secondary">
      <v-toolbar-title>Interventions à planifier</v-toolbar-title>
    </v-toolbar>
    
    <v-list lines="two">
      <v-list-item
        v-for="intervention in interventions"
        :key="intervention.id"
        :title="intervention.clientName"
        :subtitle="intervention.address"
        :active="selectedIntervention?.id === intervention.id"
        @click="selectIntervention(intervention.id)"
      >
        <template v-slot:prepend>
          <v-icon :icon="getStatusIcon(intervention.status)" :color="getStatusColor(intervention.status)"></v-icon>
        </template>
        
        <template v-slot:append>
          <v-icon icon="mdi-map-marker" color="primary"></v-icon>
        </template>
      </v-list-item>
    </v-list>

    <div v-if="interventions.length === 0" class="no-interventions">
      <v-alert type="info">Aucune intervention à planifier</v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useInterventionStore } from '../stores/interventions'

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
}

.no-interventions {
  padding: 1rem;
}

/* Make the list items more interactive */
:deep(.v-list-item--active) {
  background-color: var(--v-primary-lighten3, #e3f2fd);
}

:deep(.v-list-item:hover) {
  background-color: var(--v-grey-lighten4, #f5f5f5);
  cursor: pointer;
}
</style> 