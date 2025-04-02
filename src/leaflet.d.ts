import * as L from 'leaflet';

declare global {
  interface Window {
    customIcons: {
      intervention: L.Icon;
      subcontractor: L.Icon;
      selected: L.Icon;
    };
  }
}

// Extend Leaflet's MarkerOptions interface to include our custom property
declare module 'leaflet' {
  interface MarkerOptions {
    wasPopupOpen?: boolean;
  }
} 