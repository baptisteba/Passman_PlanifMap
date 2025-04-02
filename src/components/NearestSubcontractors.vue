<template>
  <div class="nearest-subcontractors">
    <v-toolbar density="compact" color="info">
      <v-toolbar-title>Sous-traitants les plus proches</v-toolbar-title>
    </v-toolbar>
    
    <v-list lines="two">
      <v-list-item
        v-for="(subcontractor, index) in nearestSubcontractors"
        :key="subcontractor.id"
        :title="subcontractor.name"
        :subtitle="`Distance: ${formatDistance(subcontractor.distance)}`"
      >
        <template v-slot:prepend>
          <v-avatar color="primary" size="36">
            {{ index + 1 }}
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { Subcontractor } from '../stores/subcontractors'

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
  border-top: 1px solid #e0e0e0;
}

/* Style for the ranking avatar */
:deep(.v-avatar) {
  color: white;
  font-weight: bold;
}
</style> 