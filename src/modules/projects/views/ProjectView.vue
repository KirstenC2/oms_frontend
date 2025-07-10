<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Import child components
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';

// Import types and API utility functions
import { fetchAllProjects } from '../api/project-api';
import type { Projects } from '../types/project-types';
import ProjectList from '../components/ProjectList.vue';
import CreateProjectPage from './CreateProjectPage.vue';
import ProjectGantt from '../components/ProjectGantt.vue';

// --- Reactive State ---
const loading = ref(true);
const error = ref<string | null>(null);
const view = ref('list');
const projectList = ref<any[]>([]); // Type the projectList explicitly
const projectTabs = ref([
  { label: 'Project List', value: 'list', view: 'list' },
  { label: 'Create New Project', value: 'create', view: 'create' },
  
]);
// --- Component Methods ---

const setView = (v: string) => {
  view.value = v;
  if (v === 'list') {
    getAllProjects();
  }
};


const getAllProjects = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetchAllProjects();
    // Assuming response.data contains the array of LeaveRequest
    projectList.value = response.data as Projects[]; // Cast for type safety
    if (!projectList.value || projectList.value.length === 0) {
      error.value = 'No project requests found.';
    }
  } catch (err) {
    console.error('Failed to load project requests:', err);
    error.value = 'Failed to load project requests. Please try again.';
  } finally {
    loading.value = false;
  }
};



// --- Lifecycle Hook ---
onMounted(() => {
  getAllProjects();
});
</script>

<template>
  <main>
    <SubNavBar :tabs="projectTabs" :view="view" @change="setView" />

    <h2>Project Management</h2>

    <!-- <CreateLeavePage
      v-if="view === 'create'"
      title="Create New Project Request"
      :fields="userFields"
      :submitHandler="createLeaveRequest"
    /> -->

    <div v-if="view === 'list'">
      <div v-if="loading">Loading project requests...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else class="user-container">
        <div v-if="projectList.length === 0">No project requests found.</div>
        <ProjectList
          v-else
          :projectList="projectList"/>
      </div>
      
    </div>
    <div v-else-if="view === 'create'">
      <!-- Placeholder for Create Project Page -->
       <CreateProjectPage 
        title="Create New Project "
        :fields="[]"
        :submitHandler="() => {}" />
      </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
}

h2 {
  margin-top: 20px;
  margin-bottom: 15px;
  color: #333;
}

.user-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>