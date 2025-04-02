import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDistance } from 'geolib'

export interface Subcontractor {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export const useSubcontractorStore = defineStore('subcontractor', () => {
  // State
  const subcontractors = ref<Subcontractor[]>([
    { id: '1', name: 'TechPro Paris', latitude: 48.856614, longitude: 2.352222 },
    { id: '2', name: 'NetworkFix Lyon', latitude: 45.764043, longitude: 4.835659 },
    { id: '3', name: 'ITSupport Marseille', latitude: 43.296482, longitude: 5.369780 },
    { id: '4', name: 'ConnectWorks Lille', latitude: 50.629250, longitude: 3.057256 },
    { id: '5', name: 'NetGenius Bordeaux', latitude: 44.837789, longitude: -0.579180 },
    { id: '6', name: 'TechTeam Strasbourg', latitude: 48.573405, longitude: 7.752111 },
    { id: '7', name: 'WiFiPro Nantes', latitude: 47.218371, longitude: -1.553621 },
    { id: '8', name: 'ReseauPlus Toulouse', latitude: 43.604652, longitude: 1.444209 },
    { id: '9', name: 'ConnectExpert Nice', latitude: 43.710173, longitude: 7.261953 },
    { id: '10', name: 'NetworkMaster Rennes', latitude: 48.117266, longitude: -1.677793 },
  ])

  // Actions
  function addSubcontractor(name: string, latitude: number, longitude: number) {
    const id = (subcontractors.value.length + 1).toString()
    subcontractors.value.push({ id, name, latitude, longitude })
  }

  // Find nearest subcontractors to a given location
  function findNearestSubcontractors(location: Coordinates, limit = 5) {
    return [...subcontractors.value]
      .map(subcontractor => ({
        ...subcontractor,
        distance: getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: subcontractor.latitude, longitude: subcontractor.longitude }
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
  }

  return {
    subcontractors,
    addSubcontractor,
    findNearestSubcontractors
  }
}) 