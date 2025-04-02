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
  position: relative; /* Change from absolute to relative */
  /* Remove top, left, right, bottom positioning since we're in v-main which already accounts for the app bar */
}

.map-container {
  flex: 7;
  height: 100%;
  width: 70%;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
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
  box-shadow: -1px 0 3px rgba(0, 0, 0, 0.1);
}

/* Slide up animation for the nearest subcontractors panel */
.slide-up-enter-active, 
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from, 
.slide-up-leave-to {
  transform: translateY(20px);
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
  }
  
  .interventions-container {
    height: 50%;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  }
}
</style> 