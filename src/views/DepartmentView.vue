<template>
  
  <main>
    <SubNavBar :tabs="departmentTabs" :view="view" @change="setView" />
    <h2>Departments</h2>
    <div v-if="view === 'list'">
      <div v-if="loading">Loading departments...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else>
        <div class="department-container">
          <CardContent v-for="dept in departments" :key="dept.id" :item="dept" type="department" @refreshRequest="() => {
            console.log('Event received ✅');
            loadDepartments()
          }" />
        </div>
        <div v-if="departments.length === 0">No departments found.</div>
      </div>
    </div>
    <CreateDepartmentPage v-else-if="view === 'create'" title="Create Department" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CardContent from '../components/CardContent.vue'
import type { Field } from '@/components/form/types'
import SubNavBar from '@/components/subcomponent/SubNavBar.vue'
import { fetchDepartments } from '@/modules/departments/department-api'
import CreateDepartmentPage from './departments/CreateDepartmentPage.vue'

const departments = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deptFields = ref<Field[]>([])

const loadDepartments = async () => {
  loading.value = true
  error.value = null
  try {
    const deptRes = await fetchDepartments()
    departments.value = deptRes.data

    deptFields.value = [
      { name: 'name', label: 'Department Name', type: 'text', required: true }
    ]

    if (!departments.value.length) {
      error.value = 'No departments found'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch departments'
    departments.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadDepartments()
  console.log('Departments loaded:', departments.value)
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
  flex: 1 1 calc(33.333% - 16px);
  box-sizing: border-box;
}
</style>
