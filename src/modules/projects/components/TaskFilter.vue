<template>
  <div class="controls">
    <div class="filter-group">
      <label for="statusFilter">Filter by Status:</label>
      <select id="statusFilter" :value="filterStatus" @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value)">
        <option value="">All Statuses</option>
        <option v-for="status in uniqueStatuses" :key="status" :value="status">
          {{ formatStatus(status) }}
        </option>
      </select>
    </div>
    <div class="sort-group">
      <label for="sortBy">Sort By:</label>
      <select id="sortBy" :value="sortBy" @change="$emit('update:sortBy', ($event.target as HTMLSelectElement).value)">
        <option value="startDate">Start Date</option>
        <option value="endDate">End Date</option>
        <option value="updatedAt">Updated At</option>
        <option value="name">Task Name</option>
        <option value="status">Status</option>
      </select>
      <button @click="$emit('toggle-sort-order')" class="sort-order-button">
        {{ sortOrder === 'asc' ? '↑ Asc' : '↓ Desc' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filterStatus: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  uniqueStatuses: string[]
  formatStatus: (s: string) => string
}>()

defineEmits<{
  (e: 'update:filterStatus', value: string): void
  (e: 'update:sortBy', value: string): void
  (e: 'toggle-sort-order'): void
}>()
</script>
