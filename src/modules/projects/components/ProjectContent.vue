<template>
    <h2>Project Request Details</h2>

    <div v-if="loading">Loading details...</div>
    <div v-else-if="error" style="color:red;">{{ error }}</div>
    <div v-else-if="!projectList">No project request found for this ID.</div>
    <div v-else class="details-card">
        <p><strong>Project:</strong> {{ projectList.name }} </p>
        <p><strong>Status:</strong>
            <StatusBadge :status="projectList.status" />
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import StatusBadge from '@/modules/projects/components/StatusBadge.vue'; // Adjust the import path as needed
const props = defineProps({
    projectList: {
        type: Object,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: null,
    },
});

const projectList = computed(() => props.projectList);

const emit = defineEmits<{
    (e: 'remove-project'): void;
}>();

const router = useRouter();

const goBack = () => {
    router.back();
};

const handleRemoveProject = () => {
    emit('remove-project');
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
</script>