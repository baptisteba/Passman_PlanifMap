import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDistance } from 'geolib'

export interface Subcontractor {
  id: string
  name: string
  latitude: number
  longitude: number
  type?: string
  contact?: string
  address?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export const useSubcontractorStore = defineStore('subcontractor', () => {
  // State
  const subcontractors = ref<Subcontractor[]>([
    { id: '1', name: 'TechPro Paris', latitude: 48.856614, longitude: 2.352222, type: 'Réseau', contact: 'contact@techpro.fr', address: '15 Rue de Rivoli, 75001 Paris' },
    { id: '2', name: 'NetworkFix Lyon', latitude: 45.764043, longitude: 4.835659, type: 'Support', contact: 'support@networkfix.fr', address: '10 Place Bellecour, 69002 Lyon' },
    { id: '3', name: 'ITSupport Marseille', latitude: 43.296482, longitude: 5.369780, type: 'Télécom', contact: 'info@itsupport.fr', address: '42 La Canebière, 13001 Marseille' },
    { id: '4', name: 'ConnectWorks Lille', latitude: 50.629250, longitude: 3.057256, type: 'Réseau', contact: 'service@connectworks.fr', address: '5 Place du Général de Gaulle, 59000 Lille' },
    { id: '5', name: 'NetGenius Bordeaux', latitude: 44.837789, longitude: -0.579180, type: 'Support', contact: 'contact@netgenius.fr', address: '25 Cours de l\'Intendance, 33000 Bordeaux' },
    { id: '6', name: 'TechTeam Strasbourg', latitude: 48.573405, longitude: 7.752111, type: 'Télécom', contact: 'info@techteam.fr', address: '17 Place Kléber, 67000 Strasbourg' },
    { id: '7', name: 'WiFiPro Nantes', latitude: 47.218371, longitude: -1.553621, type: 'Réseau', contact: 'support@wifipro.fr', address: '4 Place du Commerce, 44000 Nantes' },
    { id: '8', name: 'ReseauPlus Toulouse', latitude: 43.604652, longitude: 1.444209, type: 'Support', contact: 'info@reseauplus.fr', address: '21 Place du Capitole, 31000 Toulouse' },
    { id: '9', name: 'ConnectExpert Nice', latitude: 43.710173, longitude: 7.261953, type: 'Télécom', contact: 'contact@connectexpert.fr', address: '8 Avenue Jean Médecin, 06000 Nice' },
    { id: '10', name: 'NetworkMaster Rennes', latitude: 48.117266, longitude: -1.677793, type: 'Réseau', contact: 'info@networkmaster.fr', address: '12 Rue de la Monnaie, 35000 Rennes' },
  ])

  // Actions
  function addSubcontractor(name: string, latitude: number, longitude: number, type?: string, contact?: string, address?: string) {
    const id = (Math.max(...subcontractors.value.map(s => parseInt(s.id))) + 1).toString()
    subcontractors.value.push({ id, name, latitude, longitude, type, contact, address })
  }

  // Edit an existing subcontractor
  function editSubcontractor(id: string, data: Partial<Omit<Subcontractor, 'id'>>) {
    const index = subcontractors.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subcontractors.value[index] = { ...subcontractors.value[index], ...data }
    }
  }

  // Delete a subcontractor
  function deleteSubcontractor(id: string) {
    const index = subcontractors.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subcontractors.value.splice(index, 1)
    }
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
    editSubcontractor,
    deleteSubcontractor,
    findNearestSubcontractors
  }
}) 