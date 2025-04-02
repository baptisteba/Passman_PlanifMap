<template>
  <div class="settings-container">
    <v-container fluid class="px-4 py-2">
      <v-row>
        <v-col cols="12" class="py-2">
          <div class="d-flex align-center mb-6">
            <v-btn
              variant="text"
              to="/"
              class="back-link mr-3"
              size="small"
              color="primary"
              density="compact"
            >
              <v-icon icon="mdi-arrow-left" size="small" class="mr-1"></v-icon>
              Carte
            </v-btn>
            <h1 class="text-h4 font-weight-medium settings-title">Paramètres</h1>
          </div>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12">
          <v-card elevation="0" rounded="xl" class="settings-card pa-0">
            <v-card-item class="header-gradient">
              <template v-slot:prepend>
                <v-avatar color="white" variant="flat" rounded class="settings-avatar">
                  <v-icon icon="mdi-account-group" color="primary"></v-icon>
                </v-avatar>
              </template>
              
              <v-card-title class="text-white text-h5 font-weight-bold">
                Gestion des sous-traitants
              </v-card-title>
              
              <template v-slot:append>
                <v-btn
                  color="white"
                  variant="flat"
                  class="add-button"
                  @click="openAddDialog"
                  rounded="xl"
                >
                  <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                  Ajouter
                </v-btn>
              </template>
            </v-card-item>
            
            <v-card-text class="pa-0 mt-0">
              <!-- List of existing subcontractors -->
              <v-table class="subcontractor-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Adresse</th>
                    <th class="text-center actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subcontractor in subcontractors" :key="subcontractor.id" class="subcontractor-row">
                    <td class="font-weight-medium">{{ subcontractor.name }}</td>
                    <td>
                      <v-chip v-if="subcontractor.type" size="small" variant="flat" color="secondary" class="text-caption">
                        {{ subcontractor.type }}
                      </v-chip>
                      <span v-else class="text-disabled">Non spécifié</span>
                    </td>
                    <td>
                      <div v-if="subcontractor.phone" class="contact-info d-flex align-center">
                        <v-icon icon="mdi-phone" size="x-small" class="mr-1"></v-icon>
                        {{ subcontractor.phone }}
                      </div>
                      <span v-else class="text-disabled">Non spécifié</span>
                    </td>
                    <td>
                      <div v-if="subcontractor.email" class="contact-info d-flex align-center">
                        <v-icon icon="mdi-email" size="x-small" class="mr-1"></v-icon>
                        {{ subcontractor.email }}
                      </div>
                      <span v-else class="text-disabled">Non spécifié</span>
                    </td>
                    <td class="address-cell">
                      <div class="d-flex align-center">
                        <v-icon icon="mdi-map-marker" size="x-small" color="primary" class="mr-1"></v-icon>
                        <span class="address-text">{{ subcontractor.address || 'Non spécifiée' }}</span>
                      </div>
                    </td>
                    <td class="actions-cell">
                      <div class="action-buttons">
                        <v-tooltip location="top" text="Coordonnées GPS">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon
                              variant="text"
                              density="comfortable"
                              color="info"
                              v-bind="props"
                              @click="showCoordinates(subcontractor)"
                            >
                              <v-icon icon="mdi-map-marker"></v-icon>
                            </v-btn>
                          </template>
                        </v-tooltip>
                        
                        <v-tooltip location="top" text="Modifier">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon
                              variant="text"
                              density="comfortable"
                              color="primary"
                              v-bind="props"
                              @click="editSubcontractor(subcontractor)"
                            >
                              <v-icon icon="mdi-pencil"></v-icon>
                            </v-btn>
                          </template>
                        </v-tooltip>
                        
                        <v-tooltip location="top" text="Supprimer">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon
                              variant="text"
                              density="comfortable"
                              color="error"
                              v-bind="props"
                              @click="confirmDelete(subcontractor)"
                            >
                              <v-icon icon="mdi-delete"></v-icon>
                            </v-btn>
                          </template>
                        </v-tooltip>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              
              <!-- Empty state -->
              <div v-if="subcontractors.length === 0" class="empty-state pa-8 text-center">
                <v-icon icon="mdi-account-group" size="64" color="grey-lighten-3" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">Aucun sous-traitant</h3>
                <p class="text-body-2 text-grey mb-4">Ajoutez votre premier sous-traitant pour commencer</p>
                <v-btn
                  color="primary"
                  variant="elevated"
                  @click="openAddDialog"
                  rounded="xl"
                >
                  <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                  Ajouter un sous-traitant
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Dialog for adding/editing a subcontractor -->
    <v-dialog v-model="dialog" max-width="600px" class="subcontractor-dialog">
      <v-card rounded="xl" elevation="8">
        <v-toolbar color="primary" class="dialog-header" flat>
          <v-toolbar-title class="text-white">
            {{ isEditing ? 'Modifier le sous-traitant' : 'Ajouter un nouveau sous-traitant' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false" variant="text" color="white">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-toolbar>
        
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
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="currentSubcontractor.type"
                    label="Type de sous-traitant"
                    variant="outlined"
                    :items="subcontractorTypes"
                    clearable
                    prepend-inner-icon="mdi-tag"
                  ></v-select>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="currentSubcontractor.phone"
                    label="Téléphone"
                    variant="outlined"
                    clearable
                    prepend-inner-icon="mdi-phone"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="currentSubcontractor.email"
                    label="Email"
                    variant="outlined"
                    clearable
                    prepend-inner-icon="mdi-email"
                    :rules="emailRules"
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
                    prepend-inner-icon="mdi-latitude"
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
                    prepend-inner-icon="mdi-longitude"
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
        
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn 
            variant="text" 
            color="grey-darken-1" 
            @click="dialog = false"
            class="text-capitalize"
          >
            Annuler
          </v-btn>
          <v-btn 
            color="primary" 
            variant="elevated" 
            @click="saveSubcontractor"
            :disabled="!valid || !currentSubcontractor.latitude || !currentSubcontractor.longitude"
            :loading="isSaving"
            class="text-capitalize"
            rounded="xl"
          >
            {{ isEditing ? 'Enregistrer' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Coordinates display dialog -->
    <v-dialog v-model="coordsDialog" max-width="400px">
      <v-card rounded="xl" elevation="8">
        <v-toolbar color="primary" class="dialog-header" flat>
          <v-toolbar-title class="text-white">
            <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
            Coordonnées GPS
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="coordsDialog = false" variant="text" color="white">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-4 pt-6">
          <div class="d-flex align-center mb-3">
            <v-avatar color="primary" size="36" class="mr-3">
              <v-icon icon="mdi-account" color="white"></v-icon>
            </v-avatar>
            <h3 class="text-h6">{{ selectedSubcontractor?.name }}</h3>
          </div>

          <v-divider class="mb-4"></v-divider>
          
          <v-list lines="two" density="compact">
            <v-list-item v-if="selectedSubcontractor?.type">
              <template v-slot:prepend>
                <v-icon icon="mdi-tag" color="primary" size="small"></v-icon>
              </template>
              <v-list-item-title>Type</v-list-item-title>
              <v-list-item-subtitle>{{ selectedSubcontractor?.type }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item v-if="selectedSubcontractor?.phone">
              <template v-slot:prepend>
                <v-icon icon="mdi-phone" color="primary" size="small"></v-icon>
              </template>
              <v-list-item-title>Téléphone</v-list-item-title>
              <v-list-item-subtitle>{{ selectedSubcontractor?.phone }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item v-if="selectedSubcontractor?.email">
              <template v-slot:prepend>
                <v-icon icon="mdi-email" color="primary" size="small"></v-icon>
              </template>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>{{ selectedSubcontractor?.email }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item v-if="selectedSubcontractor?.address">
              <template v-slot:prepend>
                <v-icon icon="mdi-map-marker" color="primary" size="small"></v-icon>
              </template>
              <v-list-item-title>Adresse</v-list-item-title>
              <v-list-item-subtitle>{{ selectedSubcontractor?.address }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-divider class="my-2"></v-divider>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-latitude" color="primary" size="small"></v-icon>
              </template>
              <v-list-item-title>Latitude</v-list-item-title>
              <v-list-item-subtitle>{{ selectedSubcontractor?.latitude }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-longitude" color="primary" size="small"></v-icon>
              </template>
              <v-list-item-title>Longitude</v-list-item-title>
              <v-list-item-subtitle>{{ selectedSubcontractor?.longitude }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            variant="text" 
            @click="coordsDialog = false"
            class="text-capitalize"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Confirmation dialog for delete -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card rounded="xl" elevation="8">
        <v-toolbar color="primary" class="dialog-header" flat>
          <v-toolbar-title class="text-white">
            <v-icon icon="mdi-alert" class="mr-2"></v-icon>
            Confirmer la suppression
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="confirmDialog = false" variant="text" color="white">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-4 pt-6">
          <v-alert color="error" variant="tonal" density="compact" class="mb-4">
            <p>Êtes-vous sûr de vouloir supprimer <strong>{{ selectedSubcontractor?.name }}</strong> ?</p>
            <p class="mt-2 text-caption">Cette action est irréversible.</p>
          </v-alert>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="confirmDialog = false"
            class="text-capitalize"
          >
            Annuler
          </v-btn>
          <v-btn 
            color="error" 
            variant="elevated" 
            @click="deleteSubcontractor"
            class="text-capitalize"
            rounded="xl"
            :loading="isSaving"
          >
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
const isSaving = ref(false)

// List of subcontractor types
const subcontractorTypes = ['Réseau', 'Support', 'Télécom', 'Maintenance', 'Autre']

// Selected subcontractor for actions
const selectedSubcontractor = ref<Subcontractor | null>(null)

// Current subcontractor being edited or created
const currentSubcontractor = reactive({
  id: '',
  name: '',
  type: '',
  phone: '',
  email: '',
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

const emailRules = [
  (v: any) => !!v || 'L\'email est requis',
  (v: any) => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
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
    phone: '',
    email: '',
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
  
  isSaving.value = true
  
  try {
    if (isEditing.value && currentSubcontractor.id) {
      // Update existing subcontractor
      subcontractorStore.editSubcontractor(currentSubcontractor.id, {
        name: currentSubcontractor.name,
        type: currentSubcontractor.type || undefined,
        phone: currentSubcontractor.phone || undefined,
        email: currentSubcontractor.email || undefined,
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
        currentSubcontractor.phone || undefined,
        currentSubcontractor.email || undefined,
        currentSubcontractor.address
      )
    }
    
    // Close dialog
    dialog.value = false
  } catch (error) {
    console.error('Error saving subcontractor:', error)
  } finally {
    isSaving.value = false
  }
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
    phone: subcontractor.phone || '',
    email: subcontractor.email || '',
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
    isSaving.value = true
    
    try {
      subcontractorStore.deleteSubcontractor(selectedSubcontractor.value.id)
      confirmDialog.value = false
      selectedSubcontractor.value = null
    } catch (error) {
      console.error('Error deleting subcontractor:', error)
    } finally {
      isSaving.value = false
    }
  }
}

// Navigate back to the map
function goBack() {
  router.push('/')
}
</script>

<style scoped>
.settings-container {
  min-height: 100%;
  background-color: #f8f9fa;
}

.settings-title {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-light));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-top: 8px;
}

.back-link {
  transition: transform 0.2s ease;
}

.back-link:hover {
  transform: translateX(-3px);
}

.settings-card {
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.header-gradient {
  background: linear-gradient(120deg, var(--primary-color), var(--primary-light));
  padding: 20px;
}

.settings-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.subcontractor-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.subcontractor-table thead tr th {
  background-color: #f5f6f8;
  color: #162272;
  font-weight: 600;
  padding: 12px 16px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subcontractor-table tbody tr {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.subcontractor-table tbody tr:hover {
  background-color: rgba(22, 34, 114, 0.04);
}

.subcontractor-row td {
  padding: 12px 16px;
  vertical-align: middle;
}

.actions-header {
  width: 150px;
}

.actions-cell {
  width: 150px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.address-cell {
  max-width: 200px;
}

.address-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  display: inline-block;
}

.contact-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.empty-state {
  background-color: white;
  border-radius: 8px;
  margin: 24px;
}

.dialog-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style> 