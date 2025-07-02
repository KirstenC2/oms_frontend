<template>
  <main>
    <SubNavBar :tabs="roleTabs" :view="view" @change="setView" />
    <h2>Roles</h2>
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
            @refreshRequest="() => {
            console.log('Event received ✅');
            loadRoles()
          }"/>
        </div>
        <div v-if="roles.length === 0">No role found.</div>
      </div>
      </div>  
    </main>
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

const loadRoles = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetchRoles()
    roles.value = res.data

    roleFields.value = [
      { name: 'name', label: 'Role Name', type: 'text', required: true }
    ]

    if (!roles.value.length) {
      error.value = 'No roles found'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch roles'
    roles.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadRoles()
  console.log('Roles loaded:', roles.value)
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
