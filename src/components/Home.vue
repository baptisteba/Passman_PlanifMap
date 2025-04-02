<template>
  <div class="home-container">
    <!-- Map section (70%) -->
    <div class="map-container">
      <MapComponent 
        :selected-intervention="selectedIntervention" 
        :show-nearest-subcontractors="!!selectedIntervention"
      />
    </div>

    <!-- Interventions list section (30%) -->
    <div class="interventions-container">
      <InterventionList 
        @select-intervention="onSelectIntervention"
      />

      <!-- Nearest subcontractors section (shown when an intervention is selected) -->
      <NearestSubcontractors 
        v-if="selectedIntervention && nearestSubcontractors.length"
        :nearest-subcontractors="nearestSubcontractors"
      />
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
  height: calc(100vh - 48px); /* Subtract the app bar height */
  width: 100%;
  overflow: hidden;
  position: fixed; /* Changed from absolute to fixed */
  top: 48px; /* Height of the app bar */
  left: 0;
  right: 0;
  bottom: 0;
}

.map-container {
  flex: 7;
  height: 100%;
  width: 70%;
  position: relative; /* Added position relative */
}

.interventions-container {
  flex: 3;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e0e0e0;
  width: 30%;
  position: relative; /* Added position relative */
}

/* Responsive layout for mobile */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    height: calc(100vh - 48px);
  }
  
  .map-container, .interventions-container {
    width: 100%;
    height: 50%;
  }
  
  .map-container {
    height: 50vh;
  }
  
  .interventions-container {
    border-left: none;
    border-top: 1px solid #e0e0e0;
  }
}
</style> 