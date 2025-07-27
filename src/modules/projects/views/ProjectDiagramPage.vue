<script setup lang="ts">
import { ref, watch } from 'vue'; // Added computed
import { useRouter } from 'vue-router';
import '@/assets/button.css'; // Import your button styles
import type { Projects } from '@/modules/projects/types/project-types'; // Adjust the import path as needed
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import CreateDiagramPage from './CreateDiagramPage.vue';

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

const diagramList = null;
const loading = ref(true);
const error = ref<string | null>(null);
const view = ref('list');
const diagramTabs = [
    { view: 'list', label: 'Project List' },
    { view: 'create', label: 'Create New Diagram' }
];
const getAllProjects = async () => {
  loading.value = true;
  error.value = null;

//   try {
    // const response = await fetchAllProjects();
    // Assuming response.data contains the array of LeaveRequest
    // projectList.value = response.data as Projects[]; // Cast for type safety
    // if (!projectList.value || projectList.value.length === 0) {
    //   error.value = 'No project requests found.';
//     }
//   } catch (err) {
//     console.error('Failed to load project requests:', err);
//     error.value = 'Failed to load project requests. Please try again.';
//   } finally {
//     loading.value = false;
//   }
    // projectList.value =[];

};

const setView = (v: string) => {
    view.value = v;
    if (v === 'list') {
        // getProjectsDiagram();
    }
};
</script>
<template>

    <div class="project-diagram-page">
            <h2>Project ER Diagram</h2>
    <p>Here you can view the ER diagram for the project.</p>

    </div>
    <SubNavBar :tabs="diagramTabs" :view="view" @change="setView" />

    <div v-if="view === 'list'">
        <div v-if="loading" class="page-loading-message">載入專案數據中...</div>
        <div v-else-if="error" class="page-error-message">錯誤: {{ error }}</div>
        <div v-else>

        </div>

    </div>
    <div v-else-if="view === 'create'">
       <CreateDiagramPage 
        title="Create New Diagram "
        :fields="[]"
        :submitHandler="() => {}" />
      </div>
</template>



<style scoped>
.project-diagram-page {
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