<template>
    <div class="project-details-page">
        <DetailsCard
            title="Project Request Details"
            :data="projectList"
            :loading="loading"
            :error="error"
            :fieldsToDisplay="[
            { key: 'name', label: 'Project' },
            { key: 'status', label: 'Status', type: 'component', component: StatusBadge },
            { key: 'startDate', label: 'Start Date', type: 'date' },
            { key: 'endDate', label: 'End Date', type: 'date' },
            { key: 'description', label: 'Description' },
            { key: 'createdAt', label: 'Created Date' },
            { key: 'updatedAt', label: 'Last Updated' },
            { key: 'id', label: 'Request ID' }
            ]">
             <template #actions>
                <button @click="handleRemoveProject">刪除專案</button>
                <button @click="router.back()">返回專案列表</button>
            </template>
        </DetailsCard>
       
    </div>
    <div>
        <div v-if="loading" class="page-loading-message">載入專案數據中...</div>
        <div v-else-if="error" class="page-error-message">錯誤: {{ error }}</div>
        <div v-else-if="!projectList" class="page-not-found">找不到該專案。</div>
        <div v-else>
            <ProjectTaskItem
                :projects="[projectList]"
                :loading="loading"
                :error="error"
                @task-created="handleTaskCreated"
                @update-task-status="handleUpdateTaskStatus"
                @update-issue-status="handleUpdateIssueStatus"
                @issue-created="handleIssueCreated"
            />

        </div>
        
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'; // Added computed
import { useRouter } from 'vue-router';
import '@/assets/button.css'; // Import your button styles
import type { Projects } from '@/modules/projects/types/project-types'; // Adjust the import path as needed
import { deleteProjectByID, fetchProjectsByID } from '../api/project-api';
import { updateTaskStatus } from '../api/task-api'; // Import the API function for updating task statu
import { updateIssueStatus } from '../api/issue-api'; // Import the API function for updating issue status
import ProjectTaskItem from '@/modules/projects/views/ProjectTaskItem.vue';
import type { IssueStatus } from '../types/issue-type'; // Import the IssueStatus type
import StatusBadge from '@/modules/projects/components/StatusBadge.vue'; // Import the StatusBadge component
import DetailsCard from '@/components/shared/DetailsCard.vue';
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    projects: {
        type: Array as () => Projects[],
        default: () => [],
    },
});

const router = useRouter();

const projectList = ref<Projects | null>(null)
const loading = ref(true);
const error = ref<string | null>(null);

const handleTaskCreated = (task: any) => {
    console.log('Task created:', task);
    // Optionally, you can refresh the project details or perform other actions
    fetchDetails(props.id); // Refresh project details after task creation
};
const handleIssueCreated = (issue: any) => {
    console.log('Issue created:', issue);
    // Optionally, you can refresh the project details or perform other actions
    fetchDetails(props.id); // Refresh project details after issue creation
};

const handleUpdateTaskStatus = (taskId: string, status: string) => {
    console.log(`Task with ID ${taskId} status updated to ${status}`);
    updateTaskStatus(taskId, status);
};

const handleUpdateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    console.log(`Issue with ID ${issueId} status updated to ${newStatus}`);
    const res = updateIssueStatus(issueId, newStatus);
    console.log('Issue status update response:', res);
};

// Function to fetch details based on the ID
const fetchDetails = async (id: string) => {
    loading.value = true;
    error.value = null;
    projectList.value = null;

    try {
        const response = await fetchProjectsByID(id);
        projectList.value = response.data;
        console.log(projectList.value);
    } catch (err) {
        console.error('Failed to fetch project details:', err);
        error.value = 'Failed to load project details. Please try again.';
    } finally {
        loading.value = false;
    }
};



const handleRemoveProject = async () => {
    console.log(`Attempting to remove project with ID: ${projectList.value?.id}`);
    try {
        if (!projectList.value || !projectList.value.id) {
            console.error('No project found to remove.');
            error.value = 'No project found to remove.';
            return;
        }
        await deleteProjectByID(projectList.value.id); // Assuming this function deletes the project
        console.log(`Project with ID ${projectList.value.id} has been removed.`);
        router.back(); // Redirect to the project list after deletion

    } catch (error) {
        console.error('Failed to remove project:', error);
        // errorMessages = 'Failed to remove project. Please try again.';
    }
};


// const goBack = () => {
//     router.back();
// // };

// Fetch data when the component is first loaded or ID changes
watch(() => props.id, (newId) => {
    if (newId) {
        fetchDetails(newId);
    }
}, { immediate: true }); // `immediate: true` runs the watcher once on mount too, making onMounted redundant here.

</script>

<style scoped>
.project-details-page {
    padding: 20px;
    max-width: 800px;
    margin: 20px auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #333;
    text-align: center;
    margin-bottom: 25px;
}
</style>