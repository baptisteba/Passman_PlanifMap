<template>
  <div class="settings-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-icon start icon="mdi-cog"></v-icon>
              Paramètres
            </v-card-title>
            <v-card-text>
              <h3 class="text-h5 mb-4">Gestion des sous-traitants</h3>
              
              <!-- List of existing subcontractors -->
              <v-table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subcontractor in subcontractors" :key="subcontractor.id">
                    <td>{{ subcontractor.name }}</td>
                    <td>{{ subcontractor.latitude }}</td>
                    <td>{{ subcontractor.longitude }}</td>
                  </tr>
                </tbody>
              </v-table>
              
              <v-divider class="my-4"></v-divider>
              
              <!-- Button to open the dialog -->
              <v-btn 
                color="primary" 
                prepend-icon="mdi-plus" 
                @click="dialog = true"
              >
                Ajouter un sous-traitant
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row class="mt-4">
        <v-col cols="12">
          <v-btn 
            color="secondary" 
            prepend-icon="mdi-arrow-left" 
            @click="goBack"
          >
            Retour à la carte
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Dialog for adding a new subcontractor -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Ajouter un nouveau sous-traitant</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="addSubcontractor">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="newSubcontractor.name"
                    label="Nom du sous-traitant"
                    required
                    :rules="[v => !!v || 'Le nom est requis']"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="newSubcontractor.latitude"
                    label="Latitude"
                    type="number"
                    step="0.000001"
                    required
                    :rules="latitudeRules"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="newSubcontractor.longitude"
                    label="Longitude"
                    type="number"
                    step="0.000001"
                    required
                    :rules="longitudeRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">
            Annuler
          </v-btn>
          <v-btn 
            color="primary" 
            text 
            @click="addSubcontractor" 
            :disabled="!valid"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSubcontractorStore } from '../stores/subcontractors'

// Router for navigation
const router = useRouter()

// Store for subcontractors
const subcontractorStore = useSubcontractorStore()

// Computed properties
const subcontractors = computed(() => subcontractorStore.subcontractors)

// Form state
const dialog = ref(false)
const valid = ref(false)
const form = ref(null)

// Validation rules
const latitudeRules = [
  (v: any) => !!v || 'La latitude est requise',
  (v: any) => (v >= -90 && v <= 90) || 'La latitude doit être comprise entre -90 et 90'
]

const longitudeRules = [
  (v: any) => !!v || 'La longitude est requise',
  (v: any) => (v >= -180 && v <= 180) || 'La longitude doit être comprise entre -180 et 180'
]

// New subcontractor data
const newSubcontractor = ref({
  name: '',
  latitude: 0,
  longitude: 0
})

// Methods
function addSubcontractor() {
  if (valid.value) {
    subcontractorStore.addSubcontractor(
      newSubcontractor.value.name,
      newSubcontractor.value.latitude,
      newSubcontractor.value.longitude
    )
    
    // Reset form
    newSubcontractor.value = {
      name: '',
      latitude: 0,
      longitude: 0
    }
    
    // Close dialog
    dialog.value = false
  }
}

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.settings-container {
  padding: 1rem;
}
</style> 