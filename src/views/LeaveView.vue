<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Import child components
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import CreateLeavePage from './leaves/CreateLeavePage.vue';
import LeaveList from '@/components/Management/LeaveList.vue';
import LeaveDetailsModal from '@/components/Management/LeaveDetailsModal.vue'; // NEW: Import the modal component

// Import types and API utility functions
import type { LeaveRequest, Tab, FormField } from '@/types/leave'; // Ensure this matches your API response structure
import type { Field } from '@/components/form/types'; // Import the Field type for form fields
import { fetchLeaveRequests, createLeaveRequest as apiCreateLeaveRequest, cancelLeaveRequest as apiCancelLeaveRequest } from '@/components/utils/api';


// --- Reactive State ---
const loading = ref(true);
const error = ref<string | null>(null);
const view = ref('list');
const leaveList = ref<LeaveRequest[]>([]); // Type the leaveList explicitly

// Modal specific state
const isModalVisible = ref(false);
const selectedLeaveForModal = ref<LeaveRequest | null>(null); // To hold the data for the modal

const leaveTabs: Tab[] = [ // Explicitly typing it here for clarity
  { label: 'Leave List', value: 'list', view: 'list' }, // Add view property
  { label: 'Create New Leave', value: 'create', view: 'create' } // Add view property
];
const userFields = ref<FormField[]>([
  { id: 'employeeId', label: 'Employee ID', type: 'text', required: true },
  { id: 'type', label: 'Leave Type', type: 'select', options: ['Annual', 'Sick', 'Personal'], required: true },
  { id: 'startDate', label: 'Start Date', type: 'date', required: true },
  { id: 'endDate', label: 'End Date', type: 'date', required: true },
  { id: 'reason', label: 'Reason', type: 'textarea', required: true },
]);

// --- Component Methods ---

const setView = (v: string) => {
  view.value = v;
  if (v === 'list') {
    fetchData();
  }
};

const createLeaveRequest = async (formData: any) => {
  try {
    console.log('Attempting to create leave request with data:', formData);
    await apiCreateLeaveRequest(formData);
    console.log('Leave request created successfully!');
    alert('Leave request created successfully!');
    setView('list');
  } catch (err) {
    console.error('Failed to create leave request:', err);
    error.value = 'Failed to create leave request: ' + (err instanceof Error ? err.message : 'Unknown error');
    alert(`Failed to create leave request: ${error.value}`);
  }
};

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetchLeaveRequests();
    // Assuming response.data contains the array of LeaveRequest
    leaveList.value = response.data as LeaveRequest[]; // Cast for type safety
    if (!leaveList.value || leaveList.value.length === 0) {
      error.value = 'No leave requests found.';
    }
  } catch (err) {
    console.error('Failed to load leave requests:', err);
    error.value = 'Failed to load leave requests. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleCancelLeave = async (leaveId: string) => {
  try {
    console.log('Handling cancel request for ID:', leaveId);
    await apiCancelLeaveRequest(leaveId);
    console.log('Leave request cancelled successfully!');
    alert('Leave request cancelled successfully!');

    const index = leaveList.value.findIndex(leave => leave.id === leaveId);
    if (index !== -1) {
      leaveList.value[index] = { ...leaveList.value[index], status: 'CANCELLED' };
    }
  } catch (err) {
    console.error('Failed to cancel leave request:', err);
    error.value = 'Failed to cancel leave request: ' + (err instanceof Error ? err.message : 'Unknown error');
    alert(`Failed to cancel leave request: ${error.value}`);
  }
};

// NEW: Handlers for modal
const handleViewDetails = (leaveId: string) => {
  const leave = leaveList.value.find(l => l.id === leaveId);
  if (leave) {
    selectedLeaveForModal.value = leave;
    isModalVisible.value = true;
  } else {
    console.warn(`Leave with ID ${leaveId} not found for details.`);
    // Optionally set an error or alert the user
  }
};

const closeModal = () => {
  isModalVisible.value = false;
  selectedLeaveForModal.value = null; // Clear selected leave when modal closes
};

// --- Lifecycle Hook ---
onMounted(() => {
  fetchData();
});
</script>

<template>
  <main>
    <SubNavBar :tabs="leaveTabs" :view="view" @change="setView" />

    <h2>Leave Management</h2>

    <CreateLeavePage
      v-if="view === 'create'"
      title="Create New Leave Request"
      :fields="userFields"
      :submitHandler="createLeaveRequest"
    />

    <div v-else-if="view === 'list'">
      <div v-if="loading">Loading leave requests...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else class="user-container">
        <div v-if="leaveList.length === 0">No leave requests found.</div>
        <LeaveList
          v-else
          :leaveList="leaveList"
          @cancel-leave="handleCancelLeave"
          @view-details="handleViewDetails" />
      </div>
    </div>

    <LeaveDetailsModal
      :is-visible="isModalVisible"
      :leave="selectedLeaveForModal"
      @close="closeModal"
    />
  </main>
</template>

<style scoped>
main {
  padding: 20px;
}

h2 {
  margin-top: 20px;
  margin-bottom: 15px;
  color: #333;
}

.user-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>