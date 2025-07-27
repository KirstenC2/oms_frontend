<script setup lang="ts">
import { ref } from 'vue';
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import CreateDiagramPage from './CreateDiagramPage.vue';

// The 'list' view is not implemented, so we set loading to false.
const loading = ref(false);
const error = ref<string | null>(null);
const view = ref('list');

const diagramTabs = [
    { view: 'list', label: '圖表列表' },
    { view: 'create', label: 'Create New Diagram' }
];

const setView = (v: string) => {
    view.value = v;
};
</script>
<template>
    <div class="project-diagram-page">
        <h2>Project ER Diagram</h2>
        <p>Here you can view and create ER diagrams for the project.</p>
        
        <SubNavBar :tabs="diagramTabs" :view="view" @change="setView" />
        
        <div v-if="view === 'list'" class="view-container">
            <div v-if="loading" class="page-loading-message">載入圖表列表中...</div>
            <div v-else-if="error" class="page-error-message">錯誤: {{ error }}</div>
            <div v-else>
                <p>圖表列表功能尚未實作。</p>
            </div>
        </div>
        <div v-else-if="view === 'create'" class="view-container">
            <CreateDiagramPage />
        </div>
    </div>
</template>



<style scoped>
.project-diagram-page {
    padding: 20px;
    max-width: 1280px; /* Widened to fit the diagram editor */
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

.view-container {
    margin-top: 20px;
}
</style>