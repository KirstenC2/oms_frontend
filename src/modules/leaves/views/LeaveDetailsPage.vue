<template>
  <DetailsCard
    title="Leave Request Details"
    :data="leaveRequest"
    :fieldsToDisplay="[
      { key: 'employeeName', label: 'Employee' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status', type: 'component', component: StatusBadge },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'reason', label: 'Reason' },
      { key: 'id', label: 'Request ID' }
    ]"
  >
    <template #actions>
      <div class="actions">
        <button
          v-if="canApprove"
          @click="handleApproveRequest"
          class="approve-request-button"
          :disabled="isApproving"
        >
          {{ isApproving ? 'Approving...' : 'Approve Leave Request' }}
        </button>

        <button
          v-if="canReject"
          @click="handleRejectRequest"
          class="reject-request-button"
          :disabled="isRejecting"
        >
          {{ isRejecting ? 'Rejecting...' : 'Reject Leave Request' }}
        </button>

        <button
          v-if="canCancel"
          @click="handleCancelRequest"
          class="cancel-request-button"
          :disabled="isCancelling"
        >
          {{ isCancelling ? 'Cancelling...' : 'Cancel Leave Request' }}
        </button>

        <button @click="goBack" class="back-button">Go Back to List</button>
      </div>

    </template>
  </DetailsCard>
</template>




<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'; // Added computed
import { useRouter } from 'vue-router';
import '@/assets/button.css'; // Import your button styles
import { fetchLeaveRequestsByID, cancelLeaveRequest as apiCancelLeaveRequest, approveLeaveRequest, rejectLeaveRequest } from '@/modules/leaves/api/leave-api'; 
import DetailsCard from '@/components/shared/DetailsCard.vue'; // Adjust the path as necessary
import StatusBadge from '@/modules/projects/components/StatusBadge.vue'; // Adjust the path as
import type { LeaveRequest } from '@/types/leave'; // Ensure this path is correct

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const leaveRequest = ref<LeaveRequest | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const isCancelling = ref(false); // New loading state for the cancel action
const isApproving = ref(false); // NEW
const isRejecting = ref(false); // NEW
// Function to fetch details based on the ID
const fetchDetails = async (id: string) => {
  loading.value = true;
  error.value = null;
  leaveRequest.value = null;

  try {
    const response = await fetchLeaveRequestsByID(id);
    leaveRequest.value = response.data;
  } catch (err) {
    console.error('Failed to fetch leave details:', err);
    error.value = 'Failed to load leave details. Please try again.';
  } finally {
    loading.value = false;
  }
};



// Refactored computed properties for action visibility
const isPending = computed(() => leaveRequest.value?.status === 'PENDING');
const isApproved = computed(() => leaveRequest.value?.status === 'APPROVED');

const canCancel = computed(() => isPending.value); // Cancel if Pending or Approved
const canReject = isPending; // Reject only if Pending
const canApprove = isPending; // Approve only if Pending


const handleCancelRequest = async () => {
  if (!leaveRequest.value) return;

  if (confirm('Are you sure you want to cancel this leave request? This action cannot be undone.')) {
    isCancelling.value = true;
    error.value = null; // Clear any previous error

    try {
      await apiCancelLeaveRequest(leaveRequest.value.id);
      alert('Leave request cancelled successfully!');

      if (leaveRequest.value) {
        leaveRequest.value.status = 'CANCELLED';
      }
      router.back();

    } catch (err) {
      console.error('Failed to cancel leave request:', err);
      error.value = 'Failed to cancel leave request: ' + (err instanceof Error ? err.message : 'Unknown error');
      alert(`Failed to cancel leave request: ${error.value}`);
    } finally {
      isCancelling.value = false;
    }
  }
};

const handleApproveRequest = async () => { // NEW HANDLER
  if (!leaveRequest.value) return;

  if (confirm('Are you sure you want to approve this leave request?')) {
    isApproving.value = true;
    error.value = null;

    try {
      await approveLeaveRequest(leaveRequest.value.id);
      alert('Leave request approved successfully!');
      if (leaveRequest.value) {
        leaveRequest.value.status = 'APPROVED';
      }
      router.back(); // Go back to list after action
    } catch (err) {
      console.error('Failed to approve leave request:', err);
      error.value = 'Failed to approve leave request: ' + (err instanceof Error ? err.message : 'Unknown error');
      alert(`Failed to approve leave request: ${error.value}`);
    } finally {
      isApproving.value = false;
    }
  }
};

const handleRejectRequest = async () => { // NEW HANDLER
  if (!leaveRequest.value) return;

  if (confirm('Are you sure you want to reject this leave request?')) {
    isRejecting.value = true;
    error.value = null;

    try {
      await rejectLeaveRequest(leaveRequest.value.id);
      alert('Leave request rejected successfully!');
      if (leaveRequest.value) {
        leaveRequest.value.status = 'REJECTED';
      }
      router.back(); // Go back to list after action
    } catch (err) {
      console.error('Failed to reject leave request:', err);
      error.value = 'Failed to reject leave request: ' + (err instanceof Error ? err.message : 'Unknown error');
      alert(`Failed to reject leave request: ${error.value}`);
    } finally {
      isRejecting.value = false;
    }
  }
};

const goBack = () => {
  router.back();
};

// Fetch data when the component is first loaded or ID changes
watch(() => props.id, (newId) => {
  if (newId) {
    fetchDetails(newId);
  }
}, { immediate: true }); // `immediate: true` runs the watcher once on mount too, making onMounted redundant here.

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

</style>