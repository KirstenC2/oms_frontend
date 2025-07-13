<template>
  <div class="contact-card">
    <h2>{{ title }}</h2>
    <div v-if="loading">Loading details...</div>
    <div v-else-if="error" style="color:red;">{{ error }}</div>
    <div v-else-if="!client">No {{ title.toLowerCase() }} found.</div>  
    <div v-else class="contact-info">
      <p v-for="field in fieldsToDisplay" :key="field.key">
        <strong>{{ field.label }}:</strong>
        {{ client[field.key] }}
      </p>

      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  client: string | any; // Optional for client details
  loading?: boolean;
  error?: string | null;
  fieldsToDisplay: {
    key: string;
    label: string;
    type?: 'text' | 'date' | 'component'| 'client'; // 'component' = for things like StatusBadge
    component?: any; // only used if type === 'component'
  }[];
}>();

const formatDate = (date: string | Date): string => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return date?.toString() ?? '';
  }
};
</script>

<style scoped>
.contact-card {
  padding: 20px;
  background: #fdfdfd;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
  color: #333;
}

.contact-info p {
  margin: 10px 0;
}

.error {
  color: red;
}
</style>