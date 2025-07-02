<template>
  <main>
    <SubNavBar :tabs="departmentTabs" :view="view" @change="setView" />

    <h2>Departments</h2>
    <GenericCreateForm v-if="view === 'create'" title="Create Department" :fields="deptFields"
      :submitHandler="createDepartment" />
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
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CardContent from '../components/CardContent.vue'
// import CreateFormTemplate from '@/components/Management/CreateFormTemplate.vue'
import axios from 'axios'
import type { Field } from '@/components/form/types'
import SubNavBar from '@/components/subcomponent/SubNavBar.vue'
import GenericCreateForm from '@/components/form/GenericCreateForm.vue'
import { fetchDepartments, createDepartment } from '@/components/utils/api'

const departments = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deptFields = ref<Field[]>([])

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const deptRes = await fetchDepartments()
    departments.value = deptRes.data

    deptFields.value = [
      { name: 'name', label: 'Department Name', type: 'text', required: true }]
    // check for listing status
    if (!departments || departments.value.length === 0) {
      error.value = 'No departments found'
    } else {
      loading.value = false
    }
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
  flex: 1 1 calc(33.333% - 16px);
  /* 3 in a row with gap considered */
  box-sizing: border-box;
}
</style>
