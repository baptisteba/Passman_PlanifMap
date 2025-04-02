<template>
  <div class="intervention-list">
    <v-list lines="two" class="intervention-items">
      <v-list-subheader class="d-flex align-center pb-2 pt-0">
        <span class="text-subtitle-2 font-weight-bold text-uppercase">{{interventions.length}} interventions à planifier</span>
        <v-spacer></v-spacer>
        <v-chip size="x-small" variant="flat" color="primary" class="ml-2">Cliquer pour sélectionner</v-chip>
      </v-list-subheader>
      
      <v-card v-for="intervention in interventions"
        :key="intervention.id"
        :elevation="selectedIntervention?.id === intervention.id ? 4 : 0"
        :class="['intervention-card mb-3 mx-2', {'selected': selectedIntervention?.id === intervention.id}]"
        @click="selectIntervention(intervention.id)"
        rounded="lg"
      >
        <div class="d-flex align-center pa-3">
          <div :class="['status-indicator mr-3', getStatusColor(intervention.status)]">
            <v-icon :icon="getStatusIcon(intervention.status)" size="small"></v-icon>
          </div>
          
          <div class="intervention-content">
            <div class="text-subtitle-1 font-weight-medium">{{ intervention.clientName }}</div>
            <div class="text-body-2 text-grey">
              <v-icon icon="mdi-map-marker" size="x-small" class="mr-1"></v-icon>
              {{ intervention.address }}
            </div>
          </div>
          
          <v-icon 
            icon="mdi-chevron-right" 
            :color="selectedIntervention?.id === intervention.id ? 'primary' : 'grey-lighten-1'"
            class="ml-auto chevron-icon"
          ></v-icon>
        </div>
      </v-card>
    </v-list>

    <div v-if="interventions.length === 0" class="no-interventions">
      <v-alert type="info" variant="tonal" class="ma-3">
        <template v-slot:prepend>
          <v-icon icon="mdi-information"></v-icon>
        </template>
        <div class="text-center">Aucune intervention à planifier</div>
      </v-alert>
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
  background-color: transparent;
}

.intervention-items {
  flex-grow: 1;
  overflow-y: auto;
  padding-top: 0;
  background-color: transparent;
}

.intervention-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background-color: white;
}

.intervention-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0);
}

.intervention-card.selected {
  border-color: var(--primary-color);
  background-color: rgba(22, 34, 114, 0.04);
}

.intervention-card.selected::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: var(--primary-color);
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
}

.status-indicator.warning {
  background-color: rgba(255, 193, 7, 0.2);
  color: #f57c00;
}

.status-indicator.info {
  background-color: rgba(33, 150, 243, 0.2);
  color: #1976d2;
}

.status-indicator.success {
  background-color: rgba(76, 175, 80, 0.2);
  color: #388e3c;
}

.status-indicator.grey {
  background-color: rgba(158, 158, 158, 0.2);
  color: #616161;
}

.intervention-content {
  flex: 1;
  min-width: 0;
}

.intervention-content .text-subtitle-1 {
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.intervention-content .text-body-2 {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.selected .chevron-icon {
  transform: translateX(2px);
}

.intervention-card:hover .chevron-icon {
  transform: translateX(2px);
}

.no-interventions {
  padding: 1rem;
}

:deep(.v-list-subheader) {
  height: auto;
  padding: 12px 16px;
}
</style> 