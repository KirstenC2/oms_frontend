<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Issues } from '@/modules/projects/types/issue-type';
import type { Projects } from '@/modules/projects/types/project-types';
import '@/assets/button.css';
import '@/assets/table.css';

const props = defineProps<{
  issue: Issues,
  projects: Projects[]; // Assuming you want to pass the projects as well
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

// 顯示日期格式化
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};
</script>

<template>
  <tr class="project-table">
    <td>{{ issueList.title }}</td>
    <td>{{ issueList.status }}</td>
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
