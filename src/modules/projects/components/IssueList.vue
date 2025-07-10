<script setup lang="ts">
import { defineProps, computed, ref} from 'vue';
import type { Issues } from '@/modules/projects/types/issue-type'; // Make sure to adjust the path to your types
import {  IssueStatus } from '@/modules/projects/types/issue-type'; // Import necessary types
import type { User } from '@/modules/users/types/user-types'; // Import User type
import IssueListItem from './IssueListItem.vue'; // Import the ProjectListItem component
import type { Projects } from '../types/project-types';
import '@/assets/table.css'; // Import your button styles
// Define the props for this component
const props = defineProps({
  projects: {
    type: Array as () => Projects[], // Type assertion for Array of Issue
    required: true,
  },
});

const issueList = ref<Issues[]>([]); // Define a ref to hold the list of issues
issueList.value = props.projects.flatMap(project => project.issues || []); // Flatten the issues from all projects

// Define emits for actions, e.g., for handling a delete or cancel action
const emit = defineEmits(['delete-issue']); // Renamed from cancel-issue to delete-issue
console.log('IssueList component initialized with projects:', issueList.value);
// Function to handle the delete action
const handleDelete = (projectId: string) => {
  emit('delete-issue', projectId);
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Example: "2025年8月1日"
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Helper function to format status for display
const formatStatus = (status: IssueStatus): string => {
  const statusMap: Record<IssueStatus, string> = {
    [IssueStatus.OPEN]: '已開單',
    [IssueStatus.IN_PROGRESS]: '進行中',
    [IssueStatus.RESOLVED]: '已解決',
    [IssueStatus.CLOSED]: '關單',
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
  <div class="issue-section">
    <h3>All Issues</h3>
    <div v-if="issueList.length === 0" class="no-projects-message">
      No Projects Found. 
    </div>
    
    <table v-else class="project-table">
      <thead>
        <tr>
          <th>Issue</th>
          <!-- <th>描述</th> -->
          <th>Status</th>
          <th>Priority</th>
          <th>Created Date</th>
          <!-- <th>管理者</th> -->
          <th>Updated At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <IssueListItem
          v-for="issue in issueList"
          :key="issue.id"
          :issue="issue"
          :loading="false"
          :projects="projects"
          @delete-issue="handleDelete(issue.id)"
        />

        <!-- <tr v-for="issue in issueList" :key="issue.id">
          <td>{{ issue.name }}</td>
          <td>{{ issue.description || '無描述' }}</td>
          <td>{{ formatDate(issue.startDate) }}</td>
          <td>{{ formatDate(issue.endDate) }}</td>
          <td>
            <span :class="['status-badge', issue.status.toLowerCase()]">
              {{ formatStatus(issue.status) }}
            </span>
          </td>
          <td>{{ getManagerName(issue.managerId) }}</td>
          <td>{{ formatDate(issue.createdAt) }}</td>
          <td>
            <button @click="onViewDetailsClick(issue.id)" class="action-button view-button">View Details</button>
            </td>
        </tr> -->
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.issue-section {
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