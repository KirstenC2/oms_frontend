<template>
  <SubNavBar :tabs="projectTabs" :view="view" @change="setView" />

  <div v-if="view === 'list'" class="task-table-container">
    <h2>Project Tasks</h2>

    <div v-if="loading" class="loading-message">
      Loading tasks...
    </div>
    <div v-else-if="error" class="error-message">
      Error: {{ error }}
    </div>
    <div v-else-if="!allTasks || allTasks.length === 0" class="no-tasks-message">
      No tasks found for this project.
    </div>
    <div v-else>
      <div class="controls">
        <div class="filter-group">
          <label for="statusFilter">Filter by Status:</label>
          <select id="statusFilter" v-model="filterStatus">
            <option value="">All Statuses</option>
            <option v-for="status in uniqueTaskStatuses" :key="status" :value="status">
              {{ formatStatus(status) }}
            </option>
          </select>
        </div>
        <div class="sort-group">
          <label for="sortBy">Sort By:</label>
          <select id="sortBy" v-model="sortBy">
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="updatedAt">Updated At</option>
            <option value="name">Task Name</option>
            <option value="status">Status</option>
          </select>
          <button @click="toggleSortOrder" class="sort-order-button">
            {{ sortOrder === 'asc' ? '↑ Asc' : '↓ Desc' }}
          </button>
        </div>
      </div>

      <table class="task-list-table">
        <thead>
          <tr>
            <th @click="setSortBy('name')" :class="{ 'sorted-column': sortBy === 'name' }">Task Name</th>
            <th @click="setSortBy('startDate')" :class="{ 'sorted-column': sortBy === 'startDate' }">Start Date</th>
            <th @click="setSortBy('endDate')" :class="{ 'sorted-column': sortBy === 'endDate' }">End Date</th>
            <th @click="setSortBy('updatedAt')" :class="{ 'sorted-column': sortBy === 'updatedAt' }">Updated At</th>
            <th @click="setSortBy('status')" :class="{ 'sorted-column': sortBy === 'status' }">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredAndSortedTasks" :key="task.id">
            <td>{{ task.name }}</td>
            <td>{{ formatDateFull(task.startDate) }}</td>
            <td>{{ formatDateFull(task.endDate) }}</td>
            <td>{{ formatDateFull(task.updatedAt) }}</td>
            <td>
              <select :value="task.status" @change="handleStatusChange(task.id, ($event.target as HTMLSelectElement).value as TaskStatus)"
                class="status-select">
                <option v-for="statusOption in Object.values(TaskStatus)" :key="statusOption" :value="statusOption">
                  {{ formatTaskStatus(statusOption) }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

  </div>
  <div v-else-if="view === 'create'" class="task-table-container">
    <CreateTaskPage :projectId="projects[0].id" @task-created="handleTaskCreated" />
  </div>
  <div v-else-if="view === 'issueList'" class="task-table-container">
    <IssueList :projects="projects" @update-task-status="handleStatusChange" @update-issue-status="handleIssueStatusChange"/>
  </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import type { Tab } from '@/types/leave'
import { ProjectStatus, TaskStatus } from '@/modules/projects/types/project-types';
import type { Projects, Task } from '@/modules/projects/types/project-types';
import CreateTaskPage from '../views/CreateTaskPage.vue';
import IssueList from './IssueList.vue';
import { updateIssueStatus } from '../api/issue-api';
import type { IssueStatus } from '../types/issue-type';

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


const filterStatus = ref<TaskStatus | ''>(''); // Allows enum values or an empty string
const sortBy = ref<string>('startDate');
const sortOrder = ref<'asc' | 'desc'>('asc');
const view = ref('list');

const projectTabs: Tab[] = [
  { label: 'List', value: 'list', view: 'list' },
  { label: 'Create Task', value: 'create', view: 'create' },
  { label: 'Issue List', value: 'issueList', view: 'issueList' }
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
const formatTaskStatus = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.NOT_STARTED: return '未開始';
    case TaskStatus.IN_PROGRESS: return '進行中';
    case TaskStatus.COMPLETED: return '已完成';
    case TaskStatus.ON_HOLD: return '暫停';
    case TaskStatus.CANCELLED: return '已取消';
    default: return status;
  }
};

// Flatten all tasks from all projects into a single array
const allTasks = computed<Task[]>(() => {
  if (!props.projects) return [];
  return props.projects.flatMap(project => project.tasks || []);
});

// Get unique task statuses for the filter dropdown
const uniqueTaskStatuses = computed<TaskStatus[]>(() => {
  const statuses = new Set<TaskStatus>(); // Set also stores TaskStatus
  allTasks.value.forEach(task => statuses.add(task.status));
  // Convert Set to Array and sort, ensuring the type remains TaskStatus[]
  // Add a type assertion if `sort()` might return a less specific type in some TS versions
  return Array.from(statuses).sort((a, b) => a.localeCompare(b)) as TaskStatus[];
});

// Filtered tasks based on selected status
const filteredTasks = computed<Task[]>(() => {
  if (!filterStatus.value) {
    return allTasks.value;
  }
  return allTasks.value.filter(task => task.status === filterStatus.value);
});

// Filtered and then sorted tasks
const filteredAndSortedTasks = computed<Task[]>(() => {
  const tasks = [...filteredTasks.value]; // Create a shallow copy to sort

  tasks.sort((a, b) => {
    let valA: any, valB: any;

    if (sortBy.value === 'startDate' || sortBy.value === 'endDate') {
      // For dates, compare their timestamps
      valA = new Date(a[sortBy.value]).getTime();
      valB = new Date(b[sortBy.value]).getTime();
    } else {
      // For strings (name, status), use localeCompare
      valA = a[sortBy.value as keyof Task];
      valB = b[sortBy.value as keyof Task];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder.value === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return tasks;
});

// --- Methods ---

const formatDateFull = (date: Date | string): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date; // Still handles string if it somehow arrives
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatStatus = (status: ProjectStatus | TaskStatus): string => {
  const statusMap: Record<ProjectStatus | TaskStatus, string> = {
    [ProjectStatus.NOT_STARTED]: '未開始',
    [ProjectStatus.IN_PROGRESS]: '進行中',
    [ProjectStatus.COMPLETED]: '已完成',
    [ProjectStatus.ON_HOLD]: '暫停',
    [ProjectStatus.CANCELLED]: '已取消',
  };
  return statusMap[status] || status;
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

const setSortBy = (column: string) => {
  if (sortBy.value === column) {
    toggleSortOrder(); // If clicking same column, toggle order
  } else {
    sortBy.value = column; // If new column, set it and reset to asc
    sortOrder.value = 'asc';
  }
};
</script>

<style scoped>
.task-table-container {
  max-width: 1000px;
  /* Adjusted for a wider table view */
  margin: 30px auto;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2.2em;
  font-weight: 600;
}

.loading-message,
.error-message,
.no-tasks-message {
  text-align: center;
  padding: 40px;
  font-size: 1.1em;
  color: #666;
}

.error-message {
  color: #dc3545;
  font-weight: bold;
}

.controls {
  display: flex;
  justify-content: flex-end;
  /* Align to the right */
  gap: 20px;
  /* Space between filter and sort groups */
  margin-bottom: 25px;
  flex-wrap: wrap;
  /* Allow wrapping on smaller screens */
}

.filter-group,
.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

label {
  font-weight: 500;
  color: #555;
}

select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95em;
  background-color: #fff;
  cursor: pointer;
  min-width: 120px;
}

.sort-order-button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s ease;
}

.sort-order-button:hover {
  background-color: #0056b3;
}

.task-list-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  /* Ensures rounded corners apply to content */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.task-list-table th,
.task-list-table td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.task-list-table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  /* Prevent text selection on header clicks */
  transition: background-color 0.2s ease;
}

.task-list-table th:hover {
  background-color: #e9ecef;
}

.task-list-table th.sorted-column {
  background-color: #dee2e6;
  color: #212529;
}

.task-list-table tbody tr:last-child td {
  border-bottom: none;
}

.task-list-table tbody tr:hover {
  background-color: #f2f7fc;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
  text-align: center;
  min-width: 80px;
}

.status-not-started {
  background-color: #9da3ab;
}

/* Gray */
.status-in-progress {
  background-color: #20a8d8;
}

/* Blue */
.status-completed {
  background-color: #4dbd74;
}

/* Green */
.status-on-hold {
  background-color: #ffc107;
  color: #333;
}

/* Yellow (with dark text) */
.status-cancelled {
  background-color: #f86c6b;
}

/* Red */
</style>