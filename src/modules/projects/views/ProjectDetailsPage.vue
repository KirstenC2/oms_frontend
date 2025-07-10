<template>
    <div class="project-details-page">
        <h2>Project Request Details</h2>

        <div v-if="loading">Loading details...</div>
        <div v-else-if="error" style="color:red;">{{ error }}</div>
        <div v-else-if="!projectList">No project request found for this ID.</div>
        <div v-else class="details-card">
            <p><strong>Project:</strong> {{ projectList.name }} </p>
            <p><strong>Status:</strong>
                <span :class="['status-badge', projectList.status.toLowerCase()]">
                    {{ projectList.status }}
                </span>
            </p>
            <p><strong>Start Date:</strong> {{ formattedStartDate }}</p>
            <p><strong>End Date:</strong> {{ formattedEndDate }}</p>
            <p><strong>Description:</strong> {{ projectList.description }}</p>
            <p><strong>Created Date:</strong> {{ projectList.createdAt }}</p>
            <p><strong>Last Updated:</strong> {{ projectList.updatedAt }}</p>
            <p><strong>Request ID:</strong> {{ projectList.id }}</p>

            <button @click="goBack" class="back-button">Go Back to List</button>
            <button @click="handleRemoveProject">Remove project</button>
        </div>
    </div>
    <div>
        <div v-if="loading" class="page-loading-message">載入專案數據中...</div>
        <div v-else-if="error" class="page-error-message">錯誤: {{ error }}</div>
        <div v-else-if="!projectList" class="page-not-found">找不到該專案。</div>
        <div v-else>
            <ProjectTaskItem :projects="[projectList]" :loading="loading" :error="error" @task-created="handleTaskCreated"/>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'; // Added computed
import { useRouter } from 'vue-router';
import '@/assets/button.css'; // Import your button styles
import type { Projects } from '@/modules/projects/types/project-types'; // Adjust the import path as needed
import { deleteProjectByID, fetchProjectsByID } from '../api/project-api';
import ProjectTaskItem from '../components/ProjectTaskItem.vue';
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

const projectList = ref<Projects | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const handleTaskCreated = (task: any) => {
    console.log('Task created:', task);
    // Optionally, you can refresh the project details or perform other actions
    fetchDetails(props.id); // Refresh project details after task creation
};

// Function to fetch details based on the ID
const fetchDetails = async (id: string) => {
    loading.value = true;
    error.value = null;
    projectList.value = null;

    try {
        const response = await fetchProjectsByID(id);
        projectList.value = response.data;
    } catch (err) {
        console.error('Failed to fetch project details:', err);
        error.value = 'Failed to load project details. Please try again.';
    } finally {
        loading.value = false;
    }
};

// Computed property to format start date
const formattedStartDate = computed(() => {
    if (!projectList.value?.startDate) return '';
    try {
        return new Date(projectList.value.startDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch (e) {
        console.error('Error formatting start date:', e);
        return projectList.value.startDate; // Fallback to raw date
    }
});

// Computed property to format end date
const formattedEndDate = computed(() => {
    if (!projectList.value?.endDate) return '';
    try {
        return new Date(projectList.value.endDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch (e) {
        console.error('Error formatting end date:', e);
        return projectList.value.endDate; // Fallback to raw date
    }
});

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


const goBack = () => {
    router.back();
};

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