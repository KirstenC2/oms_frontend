<script setup>
import LeaveListItem from './LeaveListItem.vue'; // Adjust path as needed

const props = defineProps({
  leaveList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['cancel-leave']);

const handleCancel = (leaveId) => {
  emit('cancel-leave', leaveId);
};
</script>

<template>
  <div class="leave-section">
    <h3>All Leave Requests</h3>
    <div v-if="leaveList.length === 0">No leave requests found.</div>
    <table v-else class="leave-table">
      <thead>
        <tr>
          <th>Application Date</th>
          <th>Employee</th>
          <!-- <th>Email</th> -->
          <th>Type</th>
          <!-- <th>Start</th> -->
          <!-- <th>End</th> -->
          <!-- <th>Reason</th> -->
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <LeaveListItem
          v-for="leave in leaveList"
          :key="leave.id"
          :leave="leave"
          @cancel-request="handleCancel"
        />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.leave-section {
  margin-top: 20px;
}

.leave-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.leave-table th,
.leave-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  color: black;
}

.leave-table th {
  background-color: #f2f2f2;
}
</style>