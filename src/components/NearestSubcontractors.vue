<template>
  <div class="nearest-subcontractors">
    <v-toolbar density="compact" color="info" class="subcontractor-header">
      <v-toolbar-title class="text-subtitle-1">Sous-traitants les plus proches</v-toolbar-title>
    </v-toolbar>
    
    <v-list lines="two" class="subcontractor-items">
      <v-list-item
        v-for="(subcontractor, index) in nearestSubcontractors"
        :key="subcontractor.id"
        :title="subcontractor.name"
        :subtitle="`Distance: ${formatDistance(subcontractor.distance)}`"
        class="subcontractor-item"
      >
        <template v-slot:prepend>
          <v-avatar color="primary" size="36" class="rank-avatar">
            {{ index + 1 }}
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>
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
  background-color: white;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}

.subcontractor-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.subcontractor-items {
  flex-grow: 1;
  overflow-y: auto;
}

.subcontractor-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
}

.rank-avatar {
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.v-list-item:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}
</style> 