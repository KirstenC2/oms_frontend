<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IssueStatus, type Issues } from '@/modules/projects/types/issue-type';
import type { Projects } from '@/modules/projects/types/project-types';
import '@/assets/button.css';
import '@/assets/table.css';
import { useStatusHandler, useStatusFormatter } from '@/composable/status-utils'; // Assuming you have a composable for handling status changes
const props = defineProps<{
  issue: Issues,
  projects: Projects[]; // Assuming you want to pass the projects as well
}>();

const emit = defineEmits<{  
  (event: 'update-issue-status', taskId: string, newStatus: IssueStatus): void;
}>();
const router = useRouter();


// 安全抓取 issue list
const issueList = computed(() => {
  return props.issue || [];
});


const onViewDetailsClick = (issueId: string) => {
  console.log('Navigating to Issue Details Page:', issueId);
  router.push({ name: 'issue-details', params: { id: issueId } });
};

const { handleStatusChange: handleIssueStatusChange } = useStatusHandler<string, IssueStatus, 'update-issue-status'>(emit, 'update-issue-status');

// 顯示日期格式化
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

// Helper function to format status for display
const issueStatusMap: Record<IssueStatus, string> = {
  [IssueStatus.OPEN]: '已開單',
  [IssueStatus.IN_PROGRESS]: '進行中',
  [IssueStatus.RESOLVED]: '已解決',
  [IssueStatus.CLOSED]: '關單',
};

const { formatStatus: formatIssueStatus } = useStatusFormatter<IssueStatus>(issueStatusMap);


</script>

<template>
  <tr class="project-table">
    <td>{{ issueList.title }}</td>
    <!-- <td>{{ issueList.status }}</td> -->
    <td>
      <select :value="issueList.status"
        @change="handleIssueStatusChange(issueList.id, ($event.target as HTMLSelectElement).value as IssueStatus)"
        class="status-select">
        <option v-for="statusOption in Object.values(IssueStatus)" :key="statusOption" :value="statusOption">
          {{ formatIssueStatus(statusOption) }}
        </option>
      </select>

    </td>
    <td>{{ issueList.priority }}</td>
    <td>{{ formatDate(issueList.createdAt) }}</td>
    <td>{{ formatDate(issueList.updatedAt) }}</td>
    <td>
      <button class="view-details-btn" @click.stop="onViewDetailsClick(issueList.id)">
        View Issue
      </button>
    </td>
  </tr>
</template>
