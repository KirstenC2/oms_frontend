

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
          <th>Status</th>
          <th>Priority</th>
          <th>Created Date</th>
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
          @update-issue-status="handleUpdateIssueStatus"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref} from 'vue';
import type { Issues } from '@/modules/projects/types/issue-type'; // Make sure to adjust the path to your types
import {  IssueStatus } from '@/modules/projects/types/issue-type'; // Import necessary types
import IssueListItem from './IssueListItem.vue'; // Import the ProjectListItem component
import type { Projects } from '../types/project-types';
import '@/assets/table.css'; 
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
const emit = defineEmits(['delete-issue', 'update-issue-status']);
  
  
// Function to handle the delete action
const handleDelete = (projectId: string) => {
  emit('delete-issue', projectId);
};

const handleUpdateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
  console.log(`IssueList: Emitting update-issue-status for Issue ID: ${issueId}, New Status: ${newStatus}`);
  emit('update-issue-status', issueId, newStatus);
};


</script>

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