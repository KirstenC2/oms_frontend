<template>
  <div class="leave-details-page">
    <h2>Leave Request Details</h2>

    <div v-if="loading">Loading details...</div>
    <div v-else-if="error" style="color:red;">{{ error }}</div>
    <div v-else-if="!leaveRequest">No leave request found for this ID.</div>
    <div v-else class="details-card">
      <p><strong>Employee:</strong> {{ leaveRequest.employee.name }} ({{ leaveRequest.employee.email }})</p>
      <p><strong>Type:</strong> {{ leaveRequest.type }}</p>
      <p><strong>Status:</strong> {{ leaveRequest.status }}</p>
      <p><strong>Start Date:</strong> {{ leaveRequest.startDate }}</p>
      <p><strong>End Date:</strong> {{ leaveRequest.endDate }}</p>
      <p><strong>Reason:</strong> {{ leaveRequest.reason }}</p>
      <p><strong>Request ID:</strong> {{ leaveRequest.id }}</p>

      <button @click="goBack" class="back-button">Go Back to List</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchLeaveRequestsByID } from '@/components/utils/api'; // You'll need this API function

// Define types for your leave data structure (match your backend API response)
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
  // The 'id' prop comes directly from the route parameter because of `props: true` in router config
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const leaveRequest = ref<LeaveRequest | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Function to fetch details based on the ID
const fetchDetails = async (id: string) => {
  loading.value = true;
  error.value = null;
  leaveRequest.value = null; // Clear previous data while loading new

  try {
    const response = await fetchLeaveRequestsByID(id); // Call your API
    leaveRequest.value = response.data as LeaveRequest; // Assuming data is in response.data
  } catch (err) {
    console.error('Failed to fetch leave details:', err);
    error.value = 'Failed to load leave details. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back(); // Go back to the previous page in browser history
  // Alternatively, router.push({ name: 'leaves' }); if you want to always go to the main list
};

// Fetch data when the component is first loaded
onMounted(() => {
  fetchDetails(props.id);
});

// Watch for changes in the 'id' prop. This is useful if you navigate between
// /leaves/1 and /leaves/2 without re-mounting the component.
watch(() => props.id, (newId) => {
  if (newId) {
    fetchDetails(newId);
  }
}, { immediate: true }); // `immediate: true` runs the watcher once on mount too
</script>

<style scoped>
.leave-details-page {
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 25px;
}

.details-card {
  background-color: #fff;
  padding: 25px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.details-card p {
  margin-bottom: 10px;
  font-size: 1.1em;
  color: #555;
}

.details-card strong {
  color: #333;
  min-width: 120px;
  display: inline-block;
}

.back-button {
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>