import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Intervention {
  id: string
  clientName: string
  address: string
  latitude: number
  longitude: number
  description: string
  status: 'pending' | 'assigned' | 'completed'
}

export const useInterventionStore = defineStore('intervention', () => {
  // State
  const interventions = ref<Intervention[]>([
    {
      id: 'INT-001',
      clientName: 'Hôtel Luxe Paris',
      address: '12 Rue du Faubourg, 75008 Paris',
      latitude: 48.871046,
      longitude: 2.304764,
      description: 'Installation Wi-Fi défectueuse dans les chambres 101-110',
      status: 'pending'
    },
    {
      id: 'INT-002',
      clientName: 'Résidence Tourisme Lyon',
      address: '45 Avenue Jean Jaurès, 69007 Lyon',
      latitude: 45.735488,
      longitude: 4.835501,
      description: 'Problème de connectivité sur bornes d\'accès',
      status: 'pending'
    },
    {
      id: 'INT-003',
      clientName: 'Hôtel Méditerranée',
      address: '27 Boulevard Charles Livon, 13007 Marseille',
      latitude: 43.291839,
      longitude: 5.356678,
      description: 'Configuration routeur principal et points d\'accès',
      status: 'pending'
    },
    {
      id: 'INT-004',
      clientName: 'Auberge du Nord',
      address: '8 Place Rihour, 59800 Lille',
      latitude: 50.636822,
      longitude: 3.065448,
      description: 'Installation nouveau système Wi-Fi',
      status: 'pending'
    },
    {
      id: 'INT-005',
      clientName: 'Hôtel Atlantic',
      address: '22 Cours du Chapeau Rouge, 33000 Bordeaux',
      latitude: 44.841741,
      longitude: -0.574058,
      description: 'Remplacement équipement réseau défectueux',
      status: 'pending'
    }
  ])

  // Selected intervention for displaying on map
  const selectedIntervention = ref<Intervention | null>(null)

  // Actions
  function addIntervention(intervention: Omit<Intervention, 'id' | 'status'>) {
    const id = `INT-${String(interventions.value.length + 1).padStart(3, '0')}`
    interventions.value.push({
      ...intervention,
      id,
      status: 'pending'
    })
  }

  function selectIntervention(id: string) {
    selectedIntervention.value = interventions.value.find(i => i.id === id) || null
  }

  function updateInterventionStatus(id: string, status: 'pending' | 'assigned' | 'completed') {
    const intervention = interventions.value.find(i => i.id === id)
    if (intervention) {
      intervention.status = status
    }
  }

  return {
    interventions,
    selectedIntervention,
    addIntervention,
    selectIntervention,
    updateInterventionStatus
  }
}) 