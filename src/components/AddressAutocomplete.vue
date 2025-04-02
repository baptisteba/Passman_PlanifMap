<template>
  <div class="address-autocomplete">
    <v-text-field
      v-model="address"
      :label="label"
      :placeholder="placeholder"
      :hint="hint"
      :rules="rules"
      :disabled="disabled"
      :required="required"
      :error-messages="errorMessage"
      variant="outlined"
      autocomplete="off"
      @input="handleInputChange"
    >
      <template v-slot:append-inner>
        <v-icon 
          v-if="isLoading" 
          icon="mdi-loading" 
          class="rotate-animation"
        ></v-icon>
        <v-icon 
          v-else 
          icon="mdi-map-marker-outline"
        ></v-icon>
      </template>
    </v-text-field>

    <!-- Dropdown menu for suggestions -->
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      activator="parent"
      location="bottom"
      transition="scale-transition"
      min-width="100%"
    >
      <v-list v-if="suggestions.length > 0" density="compact">
        <v-list-item
          v-for="(suggestion, index) in suggestions"
          :key="index"
          :value="suggestion.value"
          @click="selectAddress(suggestion.value)"
        >
          <v-list-item-title>{{ suggestion.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list v-else-if="noResults" density="compact">
        <v-list-item>
          <v-list-item-title class="text-caption">Aucun résultat trouvé</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list v-else-if="menu" density="compact">
        <v-list-item>
          <v-list-item-title class="text-caption">Tapez au moins 3 caractères</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { getAddressSuggestions, debounce, geocodeAddress } from '../services/geocoding';

type ValidationRule = (value: any) => boolean | string;

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Adresse'
  },
  placeholder: {
    type: String,
    default: 'Saisissez une adresse'
  },
  hint: {
    type: String,
    default: ''
  },
  rules: {
    type: Array as () => ValidationRule[],
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'coordinates', 'error']);

const address = ref(props.modelValue);
const suggestions = ref<{ text: string; value: string }[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const menu = ref(false);
const noResults = ref(false);
const typingTimer = ref<number | null>(null);

// Update the model value when the address changes
watch(() => props.modelValue, (newValue) => {
  address.value = newValue;
});

// Update parent when our local address changes
watch(() => address.value, (newValue) => {
  emit('update:modelValue', newValue);
});

// Handle text field input
const handleInputChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  
  // Reset typing timer
  if (typingTimer.value !== null) {
    clearTimeout(typingTimer.value);
    typingTimer.value = null;
  }
  
  // Close menu if input is cleared or too short
  if (!value || value.length < 3) {
    menu.value = false;
    noResults.value = false;
    return;
  }
  
  // Set timer to show suggestions after 3 seconds of inactivity
  typingTimer.value = setTimeout(() => {
    fetchSuggestions(value).then(() => {
      // Only open menu if we have suggestions or if we need to show "no results"
      if (suggestions.value.length > 0 || noResults.value) {
        menu.value = true;
      }
    });
  }, 1500) as unknown as number;
};

// Fetch address suggestions
const fetchSuggestions = async (query: string) => {
  if (query.length < 3) {
    suggestions.value = [];
    return;
  }
  
  try {
    isLoading.value = true;
    suggestions.value = await getAddressSuggestions(query);
    noResults.value = suggestions.value.length === 0;
    errorMessage.value = '';
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    errorMessage.value = 'Erreur lors de la recherche d\'adresses';
    noResults.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Select an address from suggestions
const selectAddress = async (value: string) => {
  address.value = value;
  menu.value = false;
  
  try {
    isLoading.value = true;
    const result = await geocodeAddress(value);
    isLoading.value = false;
    
    if (result.success) {
      emit('coordinates', {
        latitude: result.latitude,
        longitude: result.longitude,
        formattedAddress: result.formattedAddress
      });
      errorMessage.value = '';
    } else {
      emit('error', result.error || 'Adresse non trouvée');
      errorMessage.value = result.error || 'Adresse non trouvée';
    }
  } catch (error) {
    isLoading.value = false;
    console.error('Error geocoding address:', error);
    const errorMsg = error instanceof Error ? error.message : 'Erreur de géocodage';
    emit('error', errorMsg);
    errorMessage.value = errorMsg;
  }
};

// Initial geocoding if there's an initial value
onMounted(async () => {
  if (address.value && address.value.length > 5) {
    try {
      isLoading.value = true;
      const result = await geocodeAddress(address.value);
      isLoading.value = false;
      
      if (result.success) {
        emit('coordinates', {
          latitude: result.latitude,
          longitude: result.longitude,
          formattedAddress: result.formattedAddress
        });
      }
    } catch (error) {
      isLoading.value = false;
      console.error('Error geocoding initial address:', error);
    }
  }
});
</script>

<style scoped>
.address-autocomplete {
  width: 100%;
  position: relative;
}

.rotate-animation {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 