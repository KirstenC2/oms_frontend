<template>
  <div class="details-card">
    <h2>{{ title }}</h2>

    <div v-if="loading">Loading details...</div>
    <div v-else-if="error" style="color:red;">{{ error }}</div>
    <div v-else-if="!data">No {{ title.toLowerCase() }} found.</div>
    <div v-else>
      <p v-for="field in fieldsToDisplay" :key="field.key">
        <strong>{{ field.label }}:</strong>
        <span v-if="field.type === 'date'">{{ formatDate(data[field.key]) }}</span>
        <component v-else-if="field.type === 'component'" :is="field.component" :status="data[field.key]" />
        <span v-else>{{ data[field.key] }}</span>
      </p>

      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  data: Record<string, any> | null;
  loading?: boolean;
  error?: string | null;
  fieldsToDisplay: {
    key: string;
    label: string;
    type?: 'text' | 'date' | 'component'; // 'component' = for things like StatusBadge
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
.details-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
}
</style>
