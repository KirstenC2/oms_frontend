<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IssueStatus, type Issues } from '@/modules/projects/types/issue-type';
import type { Projects } from '@/modules/projects/types/project-types';
import '@/assets/button.css';
import '@/assets/table.css';

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


console.log('IssueListItem component initialized with issues:', issueList.value);

const onViewDetailsClick = (issueId: string) => {
  console.log('Navigating to Issue Details Page:', issueId);
  router.push({ name: 'issue-details', params: { id: issueId } });
};

const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
  console.log(`IssueTable: Emitting update-issue-status for Task ID: ${issueId}, New Status: ${newStatus}`);
  emit('update-issue-status', issueId, newStatus);
};

// 顯示日期格式化
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

const formatStatus = (status: IssueStatus): string => {
  const statusMap: Record<IssueStatus, string> = {
    [IssueStatus.CLOSED]: '已關閉',
    [IssueStatus.OPEN]: '未開始',
    [IssueStatus.IN_PROGRESS]: '進行中',
    [IssueStatus.RESOLVED]: '已解決',
  };
  return statusMap[status] || status;
};

</script>

<template>
  <tr class="project-table">
    <td>{{ issueList.title }}</td>
    <!-- <td>{{ issueList.status }}</td> -->
    <td>
      <select :value="issueList.status"
        @change="handleStatusChange(issueList.id, ($event.target as HTMLSelectElement).value as IssueStatus)"
        class="status-select">
        <option v-for="statusOption in Object.values(IssueStatus)" :key="statusOption" :value="statusOption">
          {{ formatStatus(statusOption) }}
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
