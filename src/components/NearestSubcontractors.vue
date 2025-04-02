<template>
  <div class="nearest-subcontractors">
    <v-sheet class="px-2 py-2 d-flex align-center subcontractor-header">
      <v-icon icon="mdi-map-marker-radius" class="mr-2" color="primary"></v-icon>
      <span class="text-h6 font-weight-medium">Sous-traitants proches</span>
      <v-chip size="x-small" variant="flat" color="primary" class="ml-2">{{nearestSubcontractors.length}}</v-chip>
    </v-sheet>
    
    <div class="subcontractor-items px-2">
      <v-card
        v-for="(subcontractor, index) in nearestSubcontractors"
        :key="subcontractor.id"
        variant="flat"
        class="subcontractor-card mb-2 mt-2"
        rounded="lg"
      >
        <div class="d-flex align-center px-3 py-2">
          <div class="rank-badge mr-3" :class="`rank-${index + 1}`">
            {{ index + 1 }}
          </div>
          
          <div class="subcontractor-content">
            <div class="font-weight-medium">{{ subcontractor.name }}</div>
            <div class="text-caption d-flex align-center text-primary">
              <v-icon icon="mdi-map-marker-distance" size="x-small" class="mr-1"></v-icon>
              {{ formatDistance(subcontractor.distance) }}
            </div>
          </div>
          
          <div v-if="subcontractor.type" class="ml-auto">
            <v-chip size="x-small" variant="outlined" color="grey">
              {{ subcontractor.type }}
            </v-chip>
          </div>
        </div>
      </v-card>
      
      <div class="text-center pt-2 pb-6">
        <v-btn variant="text" size="small" color="primary" class="text-capitalize">
          <v-icon icon="mdi-reload" size="small" class="mr-1"></v-icon>
          Actualiser les distances
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Subcontractor } from '../stores/subcontractors'

// Interface for subcontractor with distance
interface SubcontractorWithDistance extends Subcontractor {
  distance: number
}

// Props
const props = defineProps<{
  nearestSubcontractors: SubcontractorWithDistance[]
}>()

// Format distance in kilometers or meters
function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`
  }
  return `${Math.round(meters)} m`
}
</script>

<style scoped>
.nearest-subcontractors {
  display: flex;
  flex-direction: column;
  height: 40%;
  overflow-y: auto;
  background-color: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.subcontractor-header {
  background-color: white;
}

.subcontractor-items {
  flex-grow: 1;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.02);
}

.subcontractor-card {
  background-color: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.subcontractor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.subcontractor-content {
  flex: 1;
  min-width: 0;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.rank-1 {
  background-color: #F9A825; /* Gold */
}

.rank-2 {
  background-color: #9E9E9E; /* Silver */
}

.rank-3 {
  background-color: #8D6E63; /* Bronze */
}

.rank-4, .rank-5 {
  background-color: var(--primary-color); /* Primary color for others */
  opacity: 0.7;
}
</style> 