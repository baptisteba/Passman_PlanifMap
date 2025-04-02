<template>
  <i :class="combinedClasses">{{ useText ? iconText : '' }}</i>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  color?: string;
  size?: string;
  useText?: boolean;
}>();

// Convert icon name to class
const iconClass = computed(() => {
  // Handle mdi- prefix
  if (props.name.startsWith('mdi-')) {
    return props.name; // Already has the prefix
  } else {
    return `mdi-${props.name}`; // Add the prefix
  }
});

// Extract the icon name without the mdi- prefix for text content fallback
const iconText = computed(() => {
  const name = props.name.replace('mdi-', '');
  // Convert kebab-case to one word (e.g., map-marker becomes mapmarker)
  return name.replace(/-/g, '');
});

// Combine all classes including icon name, color, and size
const combinedClasses = computed(() => {
  const classes = ['mdi', iconClass.value];
  
  // Add color class if provided
  if (props.color) {
    classes.push(`text-${props.color}`);
  }
  
  // Add size class if provided
  if (props.size) {
    classes.push(`mdi-${props.size}`);
  } else {
    classes.push('mdi-24px'); // Default size
  }
  
  return classes.join(' ');
});
</script>

<style scoped>
.mdi {
  font-family: 'Material Design Icons', sans-serif;
  font-style: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

/* Fallback styles for when icon font doesn't load */
.mdi:empty::before {
  content: "⚠️";
  font-family: sans-serif;
  opacity: 0.6;
}
</style> 