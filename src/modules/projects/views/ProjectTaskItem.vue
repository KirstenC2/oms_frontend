<template>
  <SubNavBar :tabs="projectTabs" :view="view" @change="setView" />

  <div v-if="view === 'list'" class="task-table-container">
    <h2>Project Tasks</h2>

    <TaskListTable :projects="projects" :loading="loading" :error="error" @update-task-status="handleStatusChange" />
  </div>
  <div v-else-if="view === 'create'" class="task-table-container">
    <CreateTaskPage :projectId="projects[0].id" @task-created="handleTaskCreated" />
  </div>
  <div v-else-if="view === 'issueList'" class="task-table-container">
    <IssueList :projects="projects" @update-task-status="handleStatusChange"
      @update-issue-status="handleIssueStatusChange" />
  </div>
  <div v-else-if="view === 'createIssue'" class="task-table-container">
    <CreateIssuePage :projectId="projects[0].id" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import type { Tab } from '@/types/leave'
import { ProjectStatus, TaskStatus } from '@/modules/projects/types/project-types';
import type { Projects, Task } from '@/modules/projects/types/project-types';
import CreateTaskPage from '../views/CreateTaskPage.vue';
import IssueList from '@/modules/projects/components/IssueList.vue';
import TaskListTable from '@/modules/projects/components/TaskListTable.vue';
import type { IssueStatus } from '@/modules/projects/types/issue-type';
import CreateIssuePage from '../views/CreateIssuePage.vue';
const props = defineProps<{
  projects: Projects[]; // Expecting an array of Projects (singular type)
  loading: boolean;     // Pass loading state from parent
  error: string | null;  // Pass error state from parent
}>();

const emit = defineEmits<{
  (event: 'task-created', task: Task): void; // Emit event when a task is created
  (event: 'update-task-status', taskId: string, status: TaskStatus): void; // Emit event when task status changes
  (event: 'update-issue-status', issueId: string, newStatus: IssueStatus): void; // Emit event when issue status changes
}>();



const view = ref('list');

const projectTabs: Tab[] = [
  { label: 'List', value: 'list', view: 'list' },
  { label: 'Create Task', value: 'create', view: 'create' },
  { label: 'Issue List', value: 'issueList', view: 'issueList' },
  { label: 'Create Issue', value: 'createIssue', view: 'createIssue' },

];


const setView = (v: string) => {
  view.value = v;
};

// --- Derived State (Computed Properties) ---
const handleTaskCreated = (task: Task) => {
  console.log('Task created:', task);
  emit('task-created', task); // Emit event to parent component
};
const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
  console.log(`TaskTable: Emitting update-task-status for Task ID: ${taskId}, New Status: ${newStatus}`);
  emit('update-task-status', taskId, newStatus);
};

const handleIssueStatusChange = (issueId: string, newStatus: IssueStatus) => {
  console.log(`ProjectTaskItem: Emitting update-issue-status for Task ID: ${issueId}, New Status: ${newStatus}`);
  emit('update-issue-status', issueId, newStatus);
};


</script>
