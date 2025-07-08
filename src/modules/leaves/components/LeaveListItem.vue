<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router'; // <--- NEW IMPORT: Import useRouter
import type { LeaveRequest } from '@/modules/leaves/types/leave-types'; // VERIFY THIS PATH
import '@/assets/button.css';
import '@/assets/table.css';

const props = defineProps<{
  leave: LeaveRequest;
}>();

// REMOVE THE EMIT DEFINITION, as it's no longer needed for navigation:
// const emit = defineEmits<{ (e: 'view-details', leaveId: string): void; }>();

const router = useRouter(); // <--- NEW: Initialize router

// Computed properties to format dates (no change)
const formattedStartDate = computed(() => {
  if (!props.leave.startDate) return '';
  return new Date(props.leave.startDate).toLocaleDateString();
});

const formattedEndDate = computed(() => {
  if (!props.leave.endDate) return '';
  return new Date(props.leave.endDate).toLocaleDateString();
});

const onViewDetailsClick = () => {
  console.log('LeaveListItem: Navigating to LeaveDetailsPage for ID:', props.leave.id);
  // Use router.push to navigate to the named route, passing the ID as a parameter
  router.push({ name: 'leave-details', params: { id: props.leave.id } });
};
</script>

<template>
  <tr>
    <td>{{ props.leave.employee.name }}</td>
    <td>{{ props.leave.type }}</td>
    <td>
      <span :class="['status-badge', props.leave.status.toLowerCase()]">
        {{ props.leave.status }}
      </span>
    </td>
    <td>{{ formattedStartDate }} - {{ formattedEndDate }}</td>
    <td>
      <button class="view-details-btn" @click.stop="onViewDetailsClick">View Details</button>
    </td>
  </tr>
</template>