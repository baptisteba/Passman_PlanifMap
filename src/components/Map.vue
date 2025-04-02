<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as L from 'leaflet'
import { useSubcontractorStore } from '../stores/subcontractors'
import { Intervention } from '../stores/interventions'

// Props
const props = defineProps<{
  selectedIntervention: Intervention | null
  showNearestSubcontractors: boolean
}>()

// Store
const subcontractorStore = useSubcontractorStore()

// DOM refs
const mapContainer = ref<HTMLElement | null>(null)

// Map state
const map = ref<L.Map | null>(null)
const subcontractorMarkers = ref<L.Marker[]>([])
const interventionMarker = ref<L.Marker | null>(null)

// Initialize the map on component mount
onMounted(() => {
  if (mapContainer.value) {
    // Create the map instance
    map.value = L.map(mapContainer.value).setView([46.603354, 1.719103], 6)

    // Add the OSM tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value)

    // Add markers for all subcontractors
    addSubcontractorMarkers()
  }
})

// Clean up on component unmount
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

// Add markers for all subcontractors
function addSubcontractorMarkers() {
  if (!map.value) return

  // Create a blue marker icon for subcontractors
  const blueIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  // Add a marker for each subcontractor
  subcontractorStore.subcontractors.forEach(subcontractor => {
    const marker = L.marker([subcontractor.latitude, subcontractor.longitude], { icon: blueIcon })
      .addTo(map.value!)
      .bindPopup(`<b>${subcontractor.name}</b>`)
    
    subcontractorMarkers.value.push(marker)
  })
}

// Watch for changes in the selected intervention
watch(() => props.selectedIntervention, (newIntervention) => {
  if (!map.value) return

  // Remove previous intervention marker if it exists
  if (interventionMarker.value) {
    map.value.removeLayer(interventionMarker.value)
    interventionMarker.value = null
  }

  // Add a new marker if an intervention is selected
  if (newIntervention) {
    // Create a red marker icon for the intervention
    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })

    // Add the marker and center the map on it
    interventionMarker.value = L.marker(
      [newIntervention.latitude, newIntervention.longitude],
      { icon: redIcon }
    )
      .addTo(map.value)
      .bindPopup(`<b>${newIntervention.clientName}</b><br>${newIntervention.address}`)
      .openPopup()
    
    // Center the map on the selected intervention
    map.value.setView([newIntervention.latitude, newIntervention.longitude], 10)
  } else {
    // Reset the view to show all of France
    map.value.setView([46.603354, 1.719103], 6)
  }
}, { immediate: true })
</script>

<style scoped>
.map-wrapper {
  height: 100%;
  width: 100%;
}

.map-container {
  height: 100%;
  width: 100%;
}
</style> 