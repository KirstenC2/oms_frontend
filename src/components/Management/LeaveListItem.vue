<script setup lang="ts">
import { useRouter } from 'vue-router'; // 1. Make sure useRouter is imported
import { computed } from 'vue'; // For date formatting
import dayjs from 'dayjs'; // Import dayjs if you're using it for date formatting

// (Interfaces for Employee and LeaveRequest should be defined here or imported)
interface Employee {
  name: string;
  email: string;
}

interface LeaveRequest {
  id: string;
  employee: Employee;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

const props = defineProps({
  leave: {
    type: Object as () => LeaveRequest,
    required: true,
  },
});

const emit = defineEmits(['cancel-request']);

// 2. Initialize useRouter to get the router instance
const router = useRouter();

const onCancelClick = (event: Event) => {
  event.stopPropagation();
  emit('cancel-request', props.leave.id);
};

// Function for the "View Details" button click
const onViewDetailsClick = (event: Event) => {
  event.stopPropagation(); // Crucial to prevent accidental row-wide clicks
  // 3. Use the 'router' instance here
  router.push({ name: 'leave-details', params: { id: props.leave.id } });
};

// Date formatting computed properties (using dayjs for example)
const formattedStartDate = computed(() => {
  if (!props.leave.startDate) return 'N/A';
  return dayjs(props.leave.startDate).format('MMM D, YYYY');
});

const formattedEndDate = computed(() => {
  if (!props.leave.endDate) return 'N/A';
  return dayjs(props.leave.endDate).format('MMM D, YYYY');
});
</script>

<template>
  <tr>
    <td>{{ props.leave.employee.name }}</td>
    <td>{{ props.leave.type }}</td>
    <td>{{ props.leave.status }}</td>
    <td>{{ formattedStartDate }} - {{ formattedEndDate }}</td> <td>
      <button class="view-details-btn" @click.stop="onViewDetailsClick">View Details</button>
    </td>
  </tr>
</template>

<style scoped>
/* (Styles for table cells and buttons remain the same from previous examples) */
td {
  color: black;
  padding: 8px;
  border: 1px solid #ddd;
}

button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
  border: none;
}

button[type="button"]:hover {
  background-color: #d32f2f;
}

.view-details-btn {
  background-color: #007bff;
  color: white;
  border: none;
}

.view-details-btn:hover {
  background-color: #0056b3;
}
</style>