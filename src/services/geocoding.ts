interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  success: boolean;
  error?: string;
}

interface AddressSuggestion {
  text: string;
  value: string;
}

// Geocode an address to get coordinates
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  try {
    // For demo purposes, using Nominatim (OpenStreetMap) - consider using a more robust service in production
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { 'Accept-Language': 'fr' } }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        formattedAddress: data[0].display_name,
        success: true
      };
    } else {
      return {
        latitude: 0,
        longitude: 0,
        formattedAddress: '',
        success: false,
        error: 'Address not found'
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      latitude: 0,
      longitude: 0,
      formattedAddress: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get address suggestions for autocomplete
export async function getAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  if (!query || query.length < 3) return [];
  
  try {
    // For demo purposes, using Nominatim (OpenStreetMap) - consider using a more robust service in production
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=fr`,
      { headers: { 'Accept-Language': 'fr' } }
    );
    
    if (!response.ok) {
      throw new Error('Address suggestion request failed');
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      text: item.display_name,
      value: item.display_name
    }));
  } catch (error) {
    console.error('Address suggestion error:', error);
    return [];
  }
}

// Make the geocoding debounced to avoid too many API calls
export function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeout: number | null = null;
  
  return function(...args: Parameters<F>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait) as unknown as number;
  };
} 