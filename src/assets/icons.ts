// Custom SVG icons for the application
import type { Icon } from 'leaflet';

export const icons = {
  // Location/map related icons
  mapMarker: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" stroke="currentColor" stroke-width="0.5" stroke-linejoin="round"/>
  </svg>`,
  
  mapMarkerMultiple: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 11.5C14 9.57 12.43 8 10.5 8C8.57 8 7 9.57 7 11.5C7 14.25 10.5 18 10.5 18C10.5 18 14 14.25 14 11.5ZM10.5 13C9.67 13 9 12.33 9 11.5C9 10.67 9.67 10 10.5 10C11.33 10 12 10.67 12 11.5C12 12.33 11.33 13 10.5 13Z" fill="currentColor" stroke="currentColor" stroke-width="0.5" stroke-linejoin="round"/>
    <path d="M18 6.5C18 4.57 16.43 3 14.5 3C12.57 3 11 4.57 11 6.5C11 9.25 14.5 13 14.5 13C14.5 13 18 9.25 18 6.5ZM14.5 8C13.67 8 13 7.33 13 6.5C13 5.67 13.67 5 14.5 5C15.33 5 16 5.67 16 6.5C16 7.33 15.33 8 14.5 8Z" fill="currentColor" stroke="currentColor" stroke-width="0.4" stroke-linejoin="round" opacity="0.8"/>
  </svg>`,
  
  // Status icons
  pending: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
  </svg>`,
  
  assigned: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
    <path d="M12 6C9.79 6 8 7.79 8 10C8 11.81 9.21 13.36 10.9 13.83C11.26 13.94 11.63 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill="currentColor"/>
    <path d="M18 17.29C16.53 16.45 14.39 16 12 16C9.61 16 7.47 16.45 6 17.29V18H18V17.29Z" fill="currentColor"/>
  </svg>`,
  
  completed: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
    <path d="M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="currentColor"/>
  </svg>`,
  
  // UI navigation and action icons
  settings: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.72 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98ZM12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z" fill="currentColor" stroke="currentColor" stroke-width="0.4" stroke-linejoin="round"/>
  </svg>`,
  
  arrowLeft: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor" stroke="currentColor" stroke-width="0.25" stroke-linejoin="round"/>
  </svg>`,
  
  plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" stroke="currentColor" stroke-width="0.25" stroke-linejoin="round"/>
  </svg>`,
  
  close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" stroke="currentColor" stroke-width="0.25" stroke-linejoin="round"/>
  </svg>`
};

// Register custom icons with Vuetify
export function registerCustomIcons(vuetify: any) {
  // Register our custom icons with the $ prefix to avoid conflicts with mdi icons
  Object.entries(icons).forEach(([name, svg]) => {
    vuetify.icons.aliases['$' + name] = svg;
  });
  
  // Make sure all mdi aliases are properly registered
  const requiredMdiIcons = [
    'mdi-map-marker',
    'mdi-map-marker-multiple',
    'mdi-clock-outline',
    'mdi-account-check',
    'mdi-check-circle',
    'mdi-help-circle',
    'mdi-cog'
  ];
  
  // Ensure these icons are registered (this is just a safety check)
  requiredMdiIcons.forEach(iconName => {
    if (!vuetify.icons.aliases[iconName.replace('mdi-', '')]) {
      console.warn(`Icon ${iconName} might not be properly registered in Vuetify.`);
    }
  });
}

// Declare type for window to add customIcons property
declare global {
  interface Window {
    customIcons: {
      intervention: Icon;
      subcontractor: Icon;
      selected: Icon;
    };
  }
} 