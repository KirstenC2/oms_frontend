<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <slot name="header">
        <h2>Leave Request Details</h2>
      </slot>
      <div class="modal-body">
        <slot>
          <p v-if="!leave">No leave request selected.</p>
          <div v-else>
            <p><strong>Employee:</strong> {{ leave.employee.name }} ({{ leave.employee.email }})</p>
            <p><strong>Type:</strong> {{ leave.type }}</p>
            <p><strong>Status:</strong> {{ leave.status }}</p>
            <p><strong>Start Date:</strong> {{ leave.startDate }}</p>
            <p><strong>End Date:</strong> {{ leave.endDate }}</p>
            <p><strong>Reason:</strong> {{ leave.reason }}</p>
            <p><strong>Request ID:</strong> {{ leave.id }}</p>
            </div>
        </slot>
      </div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Define a type for your leave object to ensure type safety
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
  // Add other properties as needed
}

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  leave: {
    type: Object as () => LeaveRequest | null, // Allow null if no leave is selected
    default: null,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's above other content */
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px; /* Max width for larger screens */
  position: relative;
  max-height: 80vh; /* Limit height to prevent overflow on small screens */
  overflow-y: auto; /* Enable scrolling if content exceeds max-height */
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  color: #000;
}

.modal-body {
  margin-top: 20px;
  line-height: 1.6;
}

.modal-body p {
  margin-bottom: 8px;
}

.modal-body strong {
  color: #555;
}
</style>