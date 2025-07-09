<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router'; // <--- NEW IMPORT: Import useRouter
// import type { LeaveRequest } from '@/modules/leaves/types/project-types'; // VERIFY THIS PATH
import type { Projects } from '@/modules/projects/types/project-types'; // Adjust path if needed
import '@/assets/button.css';
import '@/assets/table.css';

const props = defineProps<{
  projects: Projects;
}>();

const router = useRouter(); 
// Computed properties to format dates (no change)
const formattedStartDate = computed(() => {
  if (!props.projects.startDate) return '';
  return new Date(props.projects.startDate).toLocaleDateString();
});

const formattedEndDate = computed(() => {
  if (!props.projects.endDate) return '';
  return new Date(props.projects.endDate).toLocaleDateString();
});

const onViewDetailsClick = () => {
  console.log('ProjectListItem: Navigating to Project Details Page for ID:', props.projects.id);
  // Use router.push to navigate to the named route, passing the ID as a parameter
  router.push({ name: 'project-details', params: { id: props.projects.id } });
};
</script>

<template>
  <tr>
    <td>{{ props.projects.name }}</td>
    <td>{{ formattedStartDate }}</td>
    <td> {{ formattedEndDate }}</td>
    <td>
      <span :class="['status-badge', props.projects.status.toLowerCase()]">
        {{ props.projects.status }}
      </span>
    </td>
    
    <td>
      <button class="view-details-btn" @click.stop="onViewDetailsClick">View Details</button>
    </td>
  </tr>
</template>