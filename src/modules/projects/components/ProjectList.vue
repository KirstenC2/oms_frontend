<template>
  <div class="project-section">
    <h3>All Projects</h3>
    <div v-if="projectList.length === 0" class="no-projects-message">
      No Projects Found.
    </div>
    <div v-else>
      <table class="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <!-- <th>Start Date</th>
            <th>End Date</th> -->
            <th>Tasks</th>
            <th>Issues</th>
            <th>Status</th>
            <th>Action</th>
            <th>ER Diagram </th>
          </tr>
        </thead>
        <tbody>
          <ProjectListItem
            v-for="project in paginatedProjectList"
            :key="project.id"
            :projects="project"
          />

        </tbody>
      </table>
    </div>


    <div v-if="totalPages > 1" class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>

      <button v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }" @click="goToPage(page)">
        {{ page }}
      </button>

      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, computed,ref } from 'vue';
import { usePagination } from '@/composable/pagination'; // Adjust path as needed
import type { Projects } from '@/modules/projects/types/project-types'; // Make sure to adjust the path to your types
import ProjectListItem from './ProjectListItem.vue'; // Import the ProjectListItem component

const props = defineProps({
  projectList: {
    type: Array as () => Projects[], // Type assertion for Array of Project
    required: true,
  },
});

const emit = defineEmits(['delete-project']); // Renamed from cancel-project to delete-project

const {
  currentPage,
  itemsPerPage,
  totalPages,
  paginatedItems,
  goToPage,
  nextPage,
  prevPage,
} = usePagination(props.projectList, 5); // 👈 Not fully reactive if search changes


const paginatedProjectList = computed(() => paginatedItems.value);


</script>

<style scoped>
.project-section {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.no-projects-message {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

/* Action Buttons */
.action-button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  margin-right: 5px;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.action-button.delete-button {
  background-color: #dc3545;
  color: white;
}

.action-button.delete-button:hover {
  background-color: #c82333;
}

.action-button.edit-button {
  background-color: #007bff;
  color: white;
  text-decoration: none;
  /* For router-link styling */
}

.action-button.edit-button:hover {
  background-color: #0056b3;
}

.action-button.view-button {
  background-color: #07ad65;
  color: white;
  text-decoration: none;
  /* For router-link styling */
}

.action-button.view-button:hover {
  background-color: #00b392;
}
</style>