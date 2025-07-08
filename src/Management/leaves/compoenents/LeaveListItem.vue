<script setup lang="ts">
import { computed } from 'vue';
import type { LeaveRequest } from '@/types/leave'; // Adjust path if needed
import '../../assets/button.css'; // Import your button styles
const props = defineProps<{
  leave: LeaveRequest;
}>();

const emit = defineEmits<{
  (e: 'view-details', leaveId: string): void;
  // No more 'cancel' emit from here, as it's handled in the modal
}>();

// Computed properties to format dates
const formattedStartDate = computed(() => {
  if (!props.leave.startDate) return '';
  return new Date(props.leave.startDate).toLocaleDateString(); // Or use a more specific date formatter
});

const formattedEndDate = computed(() => {
  if (!props.leave.endDate) return '';
  return new Date(props.leave.endDate).toLocaleDateString(); // Or use a more specific date formatter
});

const onViewDetailsClick = () => {
  emit('view-details', props.leave.id);
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

