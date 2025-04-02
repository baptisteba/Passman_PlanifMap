<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as L from 'leaflet'
import { useSubcontractorStore } from '../stores/subcontractors'
import type { Intervention } from '../stores/interventions'

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
    // Create the map instance with a more modern tile layer with adjusted zoom control position
    map.value = L.map(mapContainer.value, {
      zoomControl: false, // Disable default zoom control
      attributionControl: true
    }).setView([46.603354, 1.719103], 6);
    
    // Add custom positioned zoom control
    L.control.zoom({
      position: 'bottomright' // Position controls at bottom right
    }).addTo(map.value as L.Map);

    // Add a modern styled map tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map.value as L.Map)

    // Create custom marker icons using SVG
    createCustomMarkerIcons();

    // Add markers for all subcontractors
    addSubcontractorMarkers();

    // Add event listeners for map movements to handle popups
    map.value.on('zoomstart', closePopupsTemporarily);
    map.value.on('zoomend', reopenActivePopups);
    map.value.on('movestart', closePopupsTemporarily);
    map.value.on('moveend', reopenActivePopups);
    map.value.on('dragstart', closePopupsTemporarily);
    map.value.on('dragend', reopenActivePopups);
    
    // Add click handler to close popups when clicking on the map outside of markers
    map.value.on('click', () => {
      closeAllPopups();
    });
  }
})

// Clean up on component unmount
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

// Create custom marker icons using SVG
function createCustomMarkerIcons() {
  // Using our custom SVG as the marker icon - improved viewBox and sizing
  const svgTemplate = (color: string, borderColor: string, size = 1) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="${24 * size}" height="${36 * size}">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 6.4 10 22 10 22s10-15.6 10-22c0-5.5-4.5-10-10-10z" 
            fill="${color}" stroke="${borderColor}" stroke-width="2"/>
      <circle cx="12" cy="12" r="4.5" fill="white" stroke="${borderColor}" stroke-width="0.5"/>
    </svg>
  `;

  // Create icons with consistent anchoring regardless of size
  const createIcon = (color: string, borderColor: string, size = 1) => {
    const svg = svgTemplate(color, borderColor, size);
    const url = 'data:image/svg+xml;base64,' + btoa(svg);
    
    // Use consistent anchoring for all icons regardless of size
    return L.icon({
      iconUrl: url,
      iconSize: [24 * size, 36 * size],
      iconAnchor: [12 * size, 36 * size], // Bottom center of the icon
      popupAnchor: [0, -36 * size]        // Position popup above the marker
    });
  };

  // Create icons with different colors
  window.customIcons = {
    intervention: createIcon('#e53935', '#b71c1c', 1.2),  // Red, slightly larger
    subcontractor: createIcon('#1976D2', '#0D47A1'),      // Blue
    selected: createIcon('#43A047', '#1B5E20')            // Green
  };
}

// Add markers for all subcontractors
function addSubcontractorMarkers() {
  if (!map.value) return
  
  // Clear existing markers first
  subcontractorMarkers.value.forEach(marker => {
    if (map.value) marker.remove();
  });
  subcontractorMarkers.value = [];
  
  // Add a marker for each subcontractor
  subcontractorStore.subcontractors.forEach(subcontractor => {
    const popupContent = `
      <div class="intervention-popup">
        <h3>${subcontractor.name || 'Unnamed Subcontractor'}</h3>
        <p><strong>Type:</strong> ${subcontractor.type || 'Not specified'}</p>
        <p><strong>Contact:</strong> ${subcontractor.contact || 'Not available'}</p>
      </div>
    `;
    
    // Create the marker
    const marker = L.marker(
      [subcontractor.latitude, subcontractor.longitude], 
      { 
        icon: window.customIcons.subcontractor
      }
    ).addTo(map.value as L.Map);
    
    // Add custom properties to the marker (outside of options)
    // @ts-ignore - Adding custom properties to marker
    marker._wasPopupOpenedByClick = false;
    // @ts-ignore - Adding custom properties to marker
    marker._isHovered = false;
    
    // Directly bind popup to marker with improved options
    const popup = marker.bindPopup(popupContent, {
      className: 'custom-popup',
      minWidth: 200,
      maxWidth: 300,
      autoPan: false,  // Don't pan when showing on hover
      closeButton: true,
      autoClose: false,
      closeOnEscapeKey: true,
      offset: [0, 0]
    });
    
    // Add hover handlers to show/hide popup
    marker.on('mouseover', function() {
      // Only show popup on hover if it's not already open from a click
      if (!marker.isPopupOpen()) {
        marker.openPopup();
        // @ts-ignore - Custom property
        marker._isHovered = true;
        
        // Add hover-popup class to style differently
        setTimeout(() => {
          const popupElement = marker.getPopup()?.getElement();
          // @ts-ignore - Custom property
          if (popupElement && !marker._wasPopupOpenedByClick) {
            popupElement.classList.add('hover-popup');
          }
        }, 0);
      }
    });
    
    marker.on('mouseout', function() {
      // Only close if this wasn't opened by a click
      // @ts-ignore - Custom property
      if (marker.isPopupOpen() && !marker._wasPopupOpenedByClick) {
        marker.closePopup();
        // @ts-ignore - Custom property
        marker._isHovered = false;
      }
    });
    
    // Add click handler
    marker.on('click', () => {
      // First close all other popups
      subcontractorMarkers.value.forEach(m => {
        if (m !== marker && m.isPopupOpen()) {
          m.closePopup();
          // @ts-ignore - Custom property
          m._wasPopupOpenedByClick = false;
          // @ts-ignore - Custom property
          m._isHovered = false;
        }
      });
      
      // Close intervention popup if open
      if (interventionMarker.value && interventionMarker.value.isPopupOpen()) {
        interventionMarker.value.closePopup();
      }
      
      // Toggle popup on click
      // @ts-ignore - Custom property
      if (marker.isPopupOpen() && marker._wasPopupOpenedByClick) {
        marker.closePopup();
        // @ts-ignore - Custom property
        marker._wasPopupOpenedByClick = false;
      } else {
        marker.openPopup();
        // @ts-ignore - Custom property
        marker._wasPopupOpenedByClick = true; // Mark as opened by click
        
        // Remove hover-popup class if it was there
        const popupElement = marker.getPopup()?.getElement();
        if (popupElement) {
          popupElement.classList.remove('hover-popup');
        }
      }
    });
    
    subcontractorMarkers.value.push(marker);
  });
}

// Function to close popups temporarily during zoom
function closePopupsTemporarily() {
  if (!map.value) return;
  
  // Get all markers
  const allMarkers = [...subcontractorMarkers.value];
  if (interventionMarker.value) {
    allMarkers.push(interventionMarker.value);
    
    // Update the stored original position if needed
    // This ensures that even after multiple zoom operations, we always have a reference point
    if (props.selectedIntervention) {
      // @ts-ignore - Custom property access
      interventionMarker.value._originalLatLng = L.latLng(
        props.selectedIntervention.latitude,
        props.selectedIntervention.longitude
      );
    }
  }
  
  // Mark active popups to reopen later
  allMarkers.forEach(marker => {
    if (marker.isPopupOpen()) {
      // @ts-ignore - Custom property
      marker._wasPopupOpenedByClick = true;
      marker.closePopup();
    }
  });
}

// Function to reopen popups after zoom
function reopenActivePopups() {
  if (!map.value) return;
  
  // Get all markers
  const allMarkers = [...subcontractorMarkers.value];
  if (interventionMarker.value && props.selectedIntervention) {
    // Always reset the intervention marker position to ensure consistency
    const lat = props.selectedIntervention.latitude;
    const lng = props.selectedIntervention.longitude;
    
    // Reset to the exact coordinates from the intervention data
    interventionMarker.value.setLatLng([lat, lng]);
    
    // Add the intervention marker to the list of markers to process
    allMarkers.push(interventionMarker.value);
  }
  
  // Reopen active popups
  allMarkers.forEach(marker => {
    // @ts-ignore - Custom property
    if (marker._wasPopupOpenedByClick) {
      marker.openPopup();
    }
  });
}

// Create an intervention marker using consistent settings
function createInterventionMarker(intervention: Intervention) {
  if (!map.value) return null;
  
  // Create marker with standardized options
  const marker = L.marker(
    [intervention.latitude, intervention.longitude],
    { 
      icon: window.customIcons.intervention,
      zIndexOffset: 1000, // Ensure intervention marker appears above subcontractor markers
      riseOnHover: true,  // Improve visibility when hovering
      riseOffset: 250     // How much to rise on hover (pixels)
    }
  ).addTo(map.value as L.Map);
  
  // Add custom properties for tracking state
  // @ts-ignore - Adding custom properties to marker
  marker._wasPopupOpenedByClick = false;
  // @ts-ignore - Custom property for position tracking
  marker._originalLatLng = L.latLng(intervention.latitude, intervention.longitude);
  
  // Create the popup content
  const popupContent = `
    <div class="intervention-popup">
      <h3>${intervention.clientName}</h3>
      <p>${intervention.address}</p>
      <p class="description">${intervention.description}</p>
    </div>
  `;
  
  // Bind popup with consistent settings
  marker.bindPopup(popupContent, {
    className: 'custom-popup intervention-detail-popup',
    minWidth: 200,
    maxWidth: 300,
    autoPan: false, // Disable auto pan
    closeButton: true,
    autoClose: false,
    closeOnEscapeKey: true,
    offset: [0, 0]
  });
  
  return marker;
}

// Watch for changes in the selected intervention
watch(() => props.selectedIntervention, (newIntervention) => {
  if (!map.value) return

  // Clear all existing popups first - make sure subcontractor popups are closed
  closeAllPopups();

  // Remove previous intervention marker if it exists
  if (interventionMarker.value) {
    interventionMarker.value.closePopup(); // Close popup first
    map.value.removeLayer(interventionMarker.value as unknown as L.Layer);
    interventionMarker.value = null;
  }

  // Reset any selection state on subcontractor markers
  subcontractorMarkers.value.forEach(marker => {
    // @ts-ignore - Custom property
    marker._wasPopupOpenedByClick = false;
  });

  // Add a new marker if an intervention is selected
  if (newIntervention) {
    // Use the dedicated function to create the intervention marker
    interventionMarker.value = createInterventionMarker(newIntervention);
    
    if (!interventionMarker.value) return;
    
    // First fit bounds to ensure we're looking at the right area
    const bounds = L.latLngBounds([
      [newIntervention.latitude, newIntervention.longitude]
    ]);
    
    // Add padding to the bounds
    bounds.extend([
      newIntervention.latitude + 0.05, 
      newIntervention.longitude + 0.05
    ]);
    bounds.extend([
      newIntervention.latitude - 0.05, 
      newIntervention.longitude - 0.05
    ]);
    
    // Zoom to bounds with options to ensure stable positioning
    map.value.fitBounds(bounds);
    
    // Then open the popup after a small delay to ensure proper positioning
    setTimeout(() => {
      if (!interventionMarker.value || !map.value) return;
      
      // Force the marker to be at the exact original position
      // This is crucial when reselecting a previously selected marker
      // @ts-ignore - Custom property
      if (interventionMarker.value._originalLatLng) {
        // @ts-ignore - Custom property
        interventionMarker.value.setLatLng(interventionMarker.value._originalLatLng);
      }
      
      interventionMarker.value.openPopup();
      // @ts-ignore - Custom property
      interventionMarker.value._wasPopupOpenedByClick = true;
    }, 100);
  } else {
    // Reset the view to show all of France
    map.value.setView([46.603354, 1.719103], 6);
  }
}, { immediate: true })

// Function to close all popups
function closeAllPopups() {
  if (!map.value) return;
  
  // Close all subcontractor marker popups
  subcontractorMarkers.value.forEach(marker => {
    if (marker.isPopupOpen()) {
      marker.closePopup();
    }
    // Reset selection state
    // @ts-ignore - Custom property
    marker._wasPopupOpenedByClick = false;
  });
  
  // Close intervention marker popup if exists
  if (interventionMarker.value && interventionMarker.value.isPopupOpen()) {
    interventionMarker.value.closePopup();
  }
  
  // Close any other popups that might be open
  map.value.closePopup();
}
</script>

<style scoped>
.map-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}

.map-container {
  height: 100%;
  width: 100%;
}

/* Ensure map controls are properly positioned */
:deep(.leaflet-control-container) {
  position: absolute;
  z-index: 800;
}

/* Bottom right controls (zoom) */
:deep(.leaflet-bottom.leaflet-right) {
  bottom: 10px;
  right: 10px;
}

/* Bottom left controls (attribution) */
:deep(.leaflet-bottom.leaflet-left) {
  bottom: 0;
  left: 0;
}

/* Add custom styles for Leaflet's popup */
:deep(.leaflet-popup) {
  margin-bottom: 0;
  transition: all 0.2s ease-in-out;
  pointer-events: auto !important;
}

/* Style for hover popups vs click popups */
:deep(.leaflet-popup.hover-popup) {
  opacity: 0.9;
  transform: translateY(5px);
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.2s ease;
}

:deep(.leaflet-popup-content) {
  margin: 12px;
  font-family: 'Roboto', sans-serif;
  line-height: 1.4;
}

:deep(.custom-popup) {
  margin-bottom: 0;
}

:deep(.intervention-detail-popup .leaflet-popup-content) {
  margin: 0;
  padding: 0;
}

:deep(.intervention-popup) {
  padding: 12px;
}

:deep(.intervention-popup h3) {
  margin: 0 0 8px 0;
  color: #1976D2;
  font-size: 16px;
  font-weight: 500;
}

:deep(.intervention-popup p) {
  margin: 0 0 8px 0;
  font-size: 14px;
}

:deep(.intervention-popup .description) {
  font-style: italic;
  color: #666;
  font-size: 13px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

/* Style for the popup tail/tip */
:deep(.leaflet-popup-tip-container) {
  width: 40px;
  height: 20px;
  position: absolute;
  left: 50%;
  margin-left: -20px;
  bottom: -20px;
  pointer-events: none;
}

:deep(.leaflet-popup-tip) {
  width: 17px;
  height: 17px;
  padding: 1px;
  margin: -10px auto 0;
  pointer-events: none;
  transform: rotate(45deg);
  background: white;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
}

:deep(.leaflet-popup-close-button) {
  padding: 6px;
  font-size: 18px;
  color: #1976D2;
  transition: color 0.2s ease;
}

:deep(.leaflet-popup-close-button:hover) {
  color: #e53935;
  text-decoration: none;
  background: transparent;
}

/* Fix for popup animations */
:deep(.leaflet-fade-anim .leaflet-popup) {
  transition: opacity 0.2s linear, transform 0.2s ease-out;
  /* Ensure popup is above other map elements */
  z-index: 1000 !important;
}

/* Enhance marker hover effect */
:deep(.leaflet-marker-icon) {
  transition: transform 0.2s ease;
}

:deep(.leaflet-marker-icon:hover) {
  transform: translateY(-2px);
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
}
</style> 