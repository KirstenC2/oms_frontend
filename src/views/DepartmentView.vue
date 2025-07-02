<template>
  <div>
    <h2>Departments</h2>
    <SubNavBar :tabs="departmentTabs" :view="view" @change="setView" />
    <CreateFormTemplate v-if="view === 'create'" title="Create Department" />
    <div v-if="view === 'list'">
      <div v-if="loading">Loading departments...</div>
        <div v-else-if="error" style="color:red;">{{ error }}</div>
        <div v-else>
          <div class="department-container">
            <CardContent v-for="dept in departments" :key="dept.id" :item="dept" type="department" />
          </div>
          <!-- <CreateFormTemplate title="Create Department" /> -->
        <div v-if="departments.length === 0">No departments found.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CardContent from '../components/CardContent.vue'
import CreateFormTemplate from '@/components/Management/CreateFormTemplate.vue'
import axios from 'axios'
import SubNavBar from '@/components/subcomponent/SubNavBar.vue'

const departments = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5001/departments')
    departments.value = res.data
    error.value = null
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch departments'
    departments.value = []
  } finally {
    loading.value = false
  }
})

const view = ref('list')
const setView = (v: string) => {
  view.value = v
}
const departmentTabs = [
  { view: 'list', label: 'Department List' },
  { view: 'create', label: 'Create New Department' }
]
</script>
<style scoped>
.department-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.department-card {
  flex: 1 1 calc(33.333% - 16px); /* 3 in a row with gap considered */
  box-sizing: border-box;
}
</style>
