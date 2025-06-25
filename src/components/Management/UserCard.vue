<template>
  <CardContent :item="user" type="user" />
</template>

<script setup lang="ts">
import CardContent from '../CardContent.vue'

defineProps<{ user: any }>()
</script>

<style scoped>
.user-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin: 1rem 0;
  max-width: 400px;
  color: #222;
}
.user-card h3 {
  margin: 0 0 0.5rem 0;
  color: #007bff;
}
.user-card p {
  margin: 0.25rem 0;
}
</style>
