<script setup>
import { ref, computed } from 'vue';
import LeaveListItem from '@/modules/leaves/components/LeaveListItem.vue';
import { usePagination } from '@/modules/leaves/composable/PaginationComposable'; // Adjust path as needed

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

const {
  currentPage,
  itemsPerPage,
  totalPages,
  paginatedItems,
  goToPage,
  nextPage,
  prevPage,
} = usePagination(props.leaveList, 10);

const paginatedLeaves = computed(() => paginatedItems.value);

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
          <th>Type</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <LeaveListItem
          v-for="leave in paginatedLeaves"
          :key="leave.id"
          :leave="leave"
          @cancel-request="handleCancel"
        />
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>

      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
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

/* Pagination styles */
.pagination-controls {
  margin-top: 15px;
  text-align: center;
}

.pagination-controls button {
  margin: 0 3px;
  padding: 5px 12px;
  border: none;
  background-color: #eee;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-controls button.active {
  background-color: #3498db;
  color: white;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
