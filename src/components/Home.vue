<template>
  <div class="home-container">
    <!-- Map section -->
    <div class="map-container">
      <MapComponent 
        :selected-intervention="selectedIntervention" 
        :show-nearest-subcontractors="!!selectedIntervention"
      />
    </div>

    <!-- Interventions list section -->
    <div class="interventions-container">
      <v-sheet class="px-2 py-2 d-flex align-center">
        <v-icon icon="mdi-clipboard-list" class="mr-2" color="primary"></v-icon>
        <span class="text-h6 font-weight-medium">Interventions</span>
      </v-sheet>
      
      <InterventionList 
        @select-intervention="onSelectIntervention"
      />

      <!-- Nearest subcontractors section (shown when an intervention is selected) -->
      <transition name="slide-up">
        <NearestSubcontractors 
          v-if="selectedIntervention && nearestSubcontractors.length"
          :nearest-subcontractors="nearestSubcontractors"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useInterventionStore } from '../stores/interventions'
import { useSubcontractorStore } from '../stores/subcontractors'
import MapComponent from './Map.vue'
import InterventionList from './InterventionList.vue'
import NearestSubcontractors from './NearestSubcontractors.vue'

// Stores
const interventionStore = useInterventionStore()
const subcontractorStore = useSubcontractorStore()

// Computed properties
const selectedIntervention = computed(() => interventionStore.selectedIntervention)
const nearestSubcontractors = ref<any[]>([])

// Watch for changes in selected intervention
watch(selectedIntervention, (newIntervention) => {
  if (newIntervention) {
    // Find nearest subcontractors when an intervention is selected
    nearestSubcontractors.value = subcontractorStore.findNearestSubcontractors({
      latitude: newIntervention.latitude,
      longitude: newIntervention.longitude
    }, 5)
  } else {
    nearestSubcontractors.value = []
  }
}, { immediate: true })

// Methods
const onSelectIntervention = (id: string) => {
  interventionStore.selectIntervention(id)
}
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100%; /* Use full height of parent container */
  width: 100%;
  overflow: hidden;
  position: relative;
  background-color: #f8f9fa;
}

.map-container {
  flex: 7;
  height: 100%;
  width: 70%;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.interventions-container {
  flex: 3;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 30%;
  position: relative;
  background-color: white;
  box-shadow: -2px 0 15px rgba(0, 0, 0, 0.06);
  border-radius: 16px 0 0 16px;
  z-index: 1;
  transition: all 0.3s ease;
}

.interventions-container::-webkit-scrollbar {
  width: 6px;
}

.interventions-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.interventions-container::-webkit-scrollbar-thumb {
  background: rgba(22, 34, 114, 0.2);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.interventions-container::-webkit-scrollbar-thumb:hover {
  background: rgba(22, 34, 114, 0.3);
}

/* Slide up animation for the nearest subcontractors panel */
.slide-up-enter-active, 
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-up-enter-from, 
.slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

/* Responsive layout for mobile */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    height: 100%;
  }
  
  .map-container, .interventions-container {
    width: 100%;
  }
  
  .map-container {
    height: 50%;
    border-radius: 0;
  }
  
  .interventions-container {
    height: 50%;
    box-shadow: 0 -8px 15px rgba(0, 0, 0, 0.08);
    border-radius: 16px 16px 0 0;
    z-index: 2;
  }
}
</style> 