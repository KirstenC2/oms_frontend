<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Projects } from '@/modules/projects/types/project-types'; // Make sure to adjust the path to your types
import {  ProjectStatus } from '@/modules/projects/types/project-types'; // Import necessary types
import type { User } from '@/modules/users/types/user-types'; // Import User type
import ProjectListItem from './ProjectListItem.vue'; // Import the ProjectListItem component
// Define the props for this component
const props = defineProps({
  projectList: {
    type: Array as () => Projects[], // Type assertion for Array of Project
    required: true,
  },
});

// Define emits for actions, e.g., for handling a delete or cancel action
const emit = defineEmits(['delete-project']); // Renamed from cancel-project to delete-project

// Function to handle the delete action
const handleDelete = (projectId: string) => {
  emit('delete-project', projectId);
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Example: "2025年8月1日"
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Helper function to format status for display
const formatStatus = (status: ProjectStatus): string => {
  const statusMap: Record<ProjectStatus, string> = {
    [ProjectStatus.NOT_STARTED]: '未開始',
    [ProjectStatus.IN_PROGRESS]: '進行中',
    [ProjectStatus.COMPLETED]: '已完成',
    [ProjectStatus.ON_HOLD]: '暫停',
    [ProjectStatus.CANCELLED]: '已取消',
  };
  return statusMap[status] || status;
};

// Helper function to get manager name
const getManagerName = (manager: User | null): string => {
  return manager ? manager.name : 'N/A';
};

// Helper function to get manager email
const getManagerEmail = (manager: User | null): string => {
  return manager ? manager.email : 'N/A';
};
</script>

<template>
  <div class="project-section">
    <h3>All Projects</h3>
    <div v-if="projectList.length === 0" class="no-projects-message">
      No Projects Found. 
    </div>
    <table v-else class="project-table">
      <thead>
        <tr>
          <th>Project Name</th>
          <!-- <th>描述</th> -->
          <th>Start Date</th>
          <th>End Date</th>
          <th>Status</th>
          <!-- <th>管理者</th> -->
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <ProjectListItem
          v-for="project in projectList"
          :key="project.id"
          :projects="project"
        />
        <!-- <tr v-for="project in projectList" :key="project.id">
          <td>{{ project.name }}</td>
          <td>{{ project.description || '無描述' }}</td>
          <td>{{ formatDate(project.startDate) }}</td>
          <td>{{ formatDate(project.endDate) }}</td>
          <td>
            <span :class="['status-badge', project.status.toLowerCase()]">
              {{ formatStatus(project.status) }}
            </span>
          </td>
          <td>{{ getManagerName(project.managerId) }}</td>
          <td>{{ formatDate(project.createdAt) }}</td>
          <td>
            <button @click="onViewDetailsClick(project.id)" class="action-button view-button">View Details</button>
            </td>
        </tr> -->
      </tbody>
    </table>
  </div>
</template>

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
  text-decoration: none; /* For router-link styling */
}

.action-button.edit-button:hover {
  background-color: #0056b3;
}

.action-button.view-button {
  background-color: #07ad65;
  color: white;
  text-decoration: none; /* For router-link styling */
}

.action-button.view-button:hover {
  background-color: #00b392;
}
</style>