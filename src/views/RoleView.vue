<template>
  <div>
    <h2>Roles</h2>
    <SubNavBar :tabs="roleTabs" :view="view" @change="setView" />
    <!-- <CreateFormTemplate v-if="view === 'create'" title="Create Role" /> -->
    <GenericCreateForm v-if="view === 'create'"
      title="Create Role"
      :fields="roleFields"
      :submitHandler="createRole"
    />
    <div v-if="view === 'list'">
      <div v-if="loading">Loading roles...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else>
        <div class="role-container">
          <CardContent
            v-for="role in roles"
            :key="role.id"
            :item="role"
            type="role"
            class="role-card"
          />
        </div>
        <div v-if="roles.length === 0">No role found.</div>
      </div>
      </div>  
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CardContent from '../components/CardContent.vue'
import SubNavBar from '@/components/subcomponent/SubNavBar.vue'
import GenericCreateForm from '@/components/form/GenericCreateForm.vue'
import axios from 'axios'
import type { Field } from '@/components/form/types'
import { fetchRoles, createRole } from '@/components/utils/api'

const roles = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const roleFields = ref<Field[]>([])

const view = ref('list')
const setView = (v: string) => {
  view.value = v
}
const roleTabs = [
  { view: 'list', label: 'Role List' },
  { view: 'create', label: 'Create New Role' }
]

onMounted(async () => {
  try {
    const deptRes = await fetchRoles()
    console.log('Fetched roles:', deptRes)
    roles.value = deptRes.data

    roleFields.value = [
      { name: 'name', label: 'Role Name', type: 'text', required: true }    ]
    // check for listing status
    if (!roles || roles.value.length === 0) {
        error.value = 'No roles found'
      } else {
        loading.value = false
      }
    }catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch roles'
    roles.value = []
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.role-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.role-card {
  flex: 1 1 calc(33.333% - 16px); /* 3 in a row with gap considered */
  box-sizing: border-box;
}
</style>
