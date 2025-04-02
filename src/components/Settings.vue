<template>
  <div class="settings-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" rounded="lg" class="settings-card">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-cog" class="mr-2"></v-icon>
              <span class="text-h5">Paramètres</span>
            </v-card-title>
            <v-card-text>
              <h3 class="text-h6 mb-4 d-flex align-center">
                <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
                Gestion des sous-traitants
              </h3>
              
              <!-- List of existing subcontractors -->
              <v-table class="subcontractor-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Contact</th>
                    <th>Adresse</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subcontractor in subcontractors" :key="subcontractor.id" class="subcontractor-row">
                    <td>{{ subcontractor.name }}</td>
                    <td>{{ subcontractor.type || 'Non spécifié' }}</td>
                    <td>{{ subcontractor.contact || 'Non spécifié' }}</td>
                    <td class="address-cell">{{ subcontractor.address || 'Non spécifiée' }}</td>
                    <td class="actions-cell">
                      <v-tooltip text="Coordonnées GPS">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            density="comfortable"
                            color="info"
                            v-bind="props"
                            @click="showCoordinates(subcontractor)"
                          >
                            <v-icon icon="mdi-map-marker"></v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                      
                      <v-tooltip text="Modifier">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            density="comfortable"
                            color="primary"
                            v-bind="props"
                            @click="editSubcontractor(subcontractor)"
                          >
                            <v-icon icon="mdi-pencil"></v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                      
                      <v-tooltip text="Supprimer">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            density="comfortable"
                            color="error"
                            v-bind="props"
                            @click="confirmDelete(subcontractor)"
                          >
                            <v-icon icon="mdi-delete"></v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              
              <v-divider class="my-6"></v-divider>
              
              <!-- Button to open the dialog -->
              <v-btn 
                color="primary" 
                class="add-button"
                elevation="2"
                @click="openAddDialog"
              >
                <v-icon icon="mdi-plus" class="mr-2"></v-icon>
                Ajouter un sous-traitant
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row class="mt-6">
        <v-col cols="12">
          <v-btn 
            color="secondary" 
            elevation="1"
            class="back-button"
            @click="goBack"
          >
            <v-icon icon="mdi-arrow-left" class="mr-2"></v-icon>
            Retour à la carte
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Dialog for adding/editing a subcontractor -->
    <v-dialog v-model="dialog" max-width="600px" class="subcontractor-dialog">
      <v-card rounded="lg" elevation="4">
        <v-card-title class="text-h5 pa-4 bg-primary text-white">
          <span>{{ isEditing ? 'Modifier le sous-traitant' : 'Ajouter un nouveau sous-traitant' }}</span>
        </v-card-title>
        
        <v-card-text class="pa-4 pt-6">
          <v-form ref="form" v-model="valid" @submit.prevent="saveSubcontractor">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="currentSubcontractor.name"
                    label="Nom du sous-traitant"
                    variant="outlined"
                    required
                    :rules="[v => !!v || 'Le nom est requis']"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="currentSubcontractor.type"
                    label="Type de sous-traitant"
                    variant="outlined"
                    :items="subcontractorTypes"
                    clearable
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model="currentSubcontractor.contact"
                    label="Contact (email ou téléphone)"
                    variant="outlined"
                    clearable
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <AddressAutocomplete
                    v-model="currentSubcontractor.address"
                    label="Adresse postale"
                    placeholder="Saisissez l'adresse complète"
                    hint="Recherchez et sélectionnez une adresse pour obtenir les coordonnées GPS"
                    :required="true"
                    :rules="[v => !!v || 'L\'adresse est requise']"
                    @coordinates="handleCoordinates"
                    @error="handleAddressError"
                  />
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="currentSubcontractor.latitude"
                    label="Latitude"
                    variant="outlined"
                    type="number"
                    step="0.000001"
                    readonly
                    disabled
                    hint="Obtenue automatiquement à partir de l'adresse"
                    persistent-hint
                    :rules="latitudeRules"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="currentSubcontractor.longitude"
                    label="Longitude"
                    variant="outlined"
                    type="number"
                    step="0.000001"
                    readonly
                    disabled
                    hint="Obtenue automatiquement à partir de l'adresse"
                    persistent-hint
                    :rules="longitudeRules"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" v-if="addressError">
                  <v-alert type="error" variant="tonal" density="compact">
                    {{ addressError }}
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="dialog = false">
            Annuler
          </v-btn>
          <v-btn 
            color="primary" 
            variant="elevated"
            @click="saveSubcontractor" 
            :disabled="!valid || !hasValidCoordinates"
          >
            {{ isEditing ? 'Enregistrer' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Coordinates display dialog -->
    <v-dialog v-model="coordsDialog" max-width="400px">
      <v-card rounded="lg" elevation="4">
        <v-card-title class="text-h6 pa-4 bg-info text-white">
          <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
          Coordonnées GPS
        </v-card-title>
        
        <v-card-text class="pa-4 pt-6">
          <p><strong>{{ selectedSubcontractor?.name }}</strong></p>
          <p class="mt-2"><strong>Latitude:</strong> {{ selectedSubcontractor?.latitude }}</p>
          <p><strong>Longitude:</strong> {{ selectedSubcontractor?.longitude }}</p>
          <p class="mt-4"><strong>Adresse:</strong> {{ selectedSubcontractor?.address || 'Non spécifiée' }}</p>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="coordsDialog = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Confirmation dialog for delete -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card rounded="lg" elevation="4">
        <v-card-title class="text-h6 pa-4 bg-error text-white">
          <v-icon icon="mdi-alert" class="mr-2"></v-icon>
          Confirmer la suppression
        </v-card-title>
        
        <v-card-text class="pa-4 pt-6">
          <p>Êtes-vous sûr de vouloir supprimer <strong>{{ selectedSubcontractor?.name }}</strong> ?</p>
          <p class="mt-2 text-caption">Cette action est irréversible.</p>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="confirmDialog = false">
            Annuler
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteSubcontractor">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useSubcontractorStore } from '../stores/subcontractors'
import type { Subcontractor } from '../stores/subcontractors'
import AddressAutocomplete from './AddressAutocomplete.vue'

// Router for navigation
const router = useRouter()

// Store for subcontractors
const subcontractorStore = useSubcontractorStore()

// Computed properties
const subcontractors = computed(() => subcontractorStore.subcontractors)

// Dialog states
const dialog = ref(false)
const coordsDialog = ref(false)
const confirmDialog = ref(false)

// Form state
const valid = ref(false)
const form = ref(null)
const addressError = ref('')
const isEditing = ref(false)

// List of subcontractor types
const subcontractorTypes = ['Réseau', 'Support', 'Télécom', 'Maintenance', 'Autre']

// Selected subcontractor for actions
const selectedSubcontractor = ref<Subcontractor | null>(null)

// Current subcontractor being edited or created
const currentSubcontractor = reactive({
  id: '',
  name: '',
  type: '',
  contact: '',
  address: '',
  latitude: 0,
  longitude: 0
})

// Validation rules
const latitudeRules = [
  (v: any) => !!v || 'La latitude est requise',
  (v: any) => (v >= -90 && v <= 90) || 'La latitude doit être comprise entre -90 et 90'
]

const longitudeRules = [
  (v: any) => !!v || 'La longitude est requise',
  (v: any) => (v >= -180 && v <= 180) || 'La longitude doit être comprise entre -180 et 180'
]

// Check if coordinates are valid
const hasValidCoordinates = computed(() => {
  return currentSubcontractor.latitude !== 0 && 
         currentSubcontractor.longitude !== 0 && 
         currentSubcontractor.latitude >= -90 && 
         currentSubcontractor.latitude <= 90 && 
         currentSubcontractor.longitude >= -180 && 
         currentSubcontractor.longitude <= 180
})

// Open dialog to add a new subcontractor
function openAddDialog() {
  // Reset to default values
  Object.assign(currentSubcontractor, {
    id: '',
    name: '',
    type: '',
    contact: '',
    address: '',
    latitude: 0,
    longitude: 0
  })
  
  isEditing.value = false
  addressError.value = ''
  dialog.value = true
}

// Handle coordinates from address autocomplete
function handleCoordinates(coords: { latitude: number; longitude: number; formattedAddress: string }) {
  currentSubcontractor.latitude = coords.latitude
  currentSubcontractor.longitude = coords.longitude
  
  // If the address was updated by the geocoder, use the formatted one
  if (coords.formattedAddress && coords.formattedAddress !== currentSubcontractor.address) {
    currentSubcontractor.address = coords.formattedAddress
  }
  
  addressError.value = ''
}

// Handle address lookup error
function handleAddressError(error: string) {
  addressError.value = error
  currentSubcontractor.latitude = 0
  currentSubcontractor.longitude = 0
}

// Save the current subcontractor (add or edit)
function saveSubcontractor() {
  if (!valid.value || !hasValidCoordinates.value) return
  
  if (isEditing.value && currentSubcontractor.id) {
    // Update existing subcontractor
    subcontractorStore.editSubcontractor(currentSubcontractor.id, {
      name: currentSubcontractor.name,
      type: currentSubcontractor.type || undefined,
      contact: currentSubcontractor.contact || undefined,
      address: currentSubcontractor.address,
      latitude: currentSubcontractor.latitude,
      longitude: currentSubcontractor.longitude
    })
  } else {
    // Add new subcontractor
    subcontractorStore.addSubcontractor(
      currentSubcontractor.name,
      currentSubcontractor.latitude,
      currentSubcontractor.longitude,
      currentSubcontractor.type || undefined,
      currentSubcontractor.contact || undefined,
      currentSubcontractor.address
    )
  }
  
  // Close dialog
  dialog.value = false
}

// Show coordinates dialog
function showCoordinates(subcontractor: Subcontractor) {
  selectedSubcontractor.value = subcontractor
  coordsDialog.value = true
}

// Edit a subcontractor
function editSubcontractor(subcontractor: Subcontractor) {
  // Copy data to the current subcontractor
  Object.assign(currentSubcontractor, {
    id: subcontractor.id,
    name: subcontractor.name,
    type: subcontractor.type || '',
    contact: subcontractor.contact || '',
    address: subcontractor.address || '',
    latitude: subcontractor.latitude,
    longitude: subcontractor.longitude
  })
  
  isEditing.value = true
  addressError.value = ''
  dialog.value = true
}

// Confirm delete dialog
function confirmDelete(subcontractor: Subcontractor) {
  selectedSubcontractor.value = subcontractor
  confirmDialog.value = true
}

// Delete a subcontractor
function deleteSubcontractor() {
  if (selectedSubcontractor.value) {
    subcontractorStore.deleteSubcontractor(selectedSubcontractor.value.id)
    confirmDialog.value = false
    selectedSubcontractor.value = null
  }
}

// Navigate back to the map
function goBack() {
  router.push('/')
}
</script>

<style scoped>
.settings-container {
  padding: 1rem;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.settings-card {
  margin-bottom: 1rem;
  overflow: hidden;
}

.subcontractor-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.subcontractor-row {
  transition: background-color 0.2s ease;
}

.subcontractor-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.address-cell {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.add-button {
  transition: transform 0.2s ease;
}

.add-button:hover {
  transform: translateY(-2px);
}

.back-button {
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: translateX(-2px);
}
</style> 