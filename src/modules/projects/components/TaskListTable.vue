<!-- TaskListTable.vue -->
<template>
  <table class="task-list-table">
    <thead>
      <tr>
        <th @click="$emit('sort-by', 'name')" :class="{ 'sorted-column': sortBy === 'name' }">Task Name</th>
        <th @click="$emit('sort-by', 'startDate')" :class="{ 'sorted-column': sortBy === 'startDate' }">Start Date</th>
        <th @click="$emit('sort-by', 'endDate')" :class="{ 'sorted-column': sortBy === 'endDate' }">End Date</th>
        <th @click="$emit('sort-by', 'updatedAt')" :class="{ 'sorted-column': sortBy === 'updatedAt' }">Updated At</th>
        <th @click="$emit('sort-by', 'status')" :class="{ 'sorted-column': sortBy === 'status' }">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="task in tasks" :key="task.id">
        <td>{{ task.name }}</td>
        <td>{{ formatDate(task.startDate) }}</td>
        <td>{{ formatDate(task.endDate) }}</td>
        <td>{{ formatDate(task.updatedAt) }}</td>
        <td>
          <select :value="task.status" @change="$emit('status-change', task.id, ($event.target as HTMLSelectElement).value)">
            <option v-for="s in taskStatuses" :key="s" :value="s">{{ formatTaskStatus(s) }}</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{
  tasks: any[]
  sortBy: string
  formatDate: (d: string) => string
  formatTaskStatus: (s: string) => string
  taskStatuses: string[]
}>()

defineEmits<{
  (e: 'sort-by', key: string): void
  (e: 'status-change', id: string, newStatus: string): void
}>()
</script>
