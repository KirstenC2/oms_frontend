<template>
  <main>
    <SubNavBar :tabs="userTabs" :view="view" @change="setView" />
    <UsersUpdateForm v-if="view === 'update'" />
    <!-- <CreateFormTemplate v-else-if="view === 'create'" title="Create User"  /> -->
    <GenericCreateForm v-else-if="view === 'create'"
    title="Create User"
    :fields="userFields"
    :submitHandler="createUser"
  />
    
    <div v-else-if="view === 'list'">
      <div v-if="loading">Loading users...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else>
        <UserCard v-for="user in userList" :key="user.id" :user="user" />
        <div v-if="userList.length === 0">No users found.</div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UsersUpdateForm from '../components/Management/UsersUpdateForm.vue';
// import CreateFormTemplate from '../components/Management/CreateFormTemplate.vue';
import UserCard from '../components/Management/UserCard.vue';
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import axios from 'axios'
import type { Field } from '@/components/form/types'
import { fetchDepartments, fetchRoles, fetchUsers, createUser } from '@/components/utils/api'
import GenericCreateForm from '@/components/form/GenericCreateForm.vue';


const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

const view = ref('list')
const setView = (v: string) => {
  view.value = v
}


const userTabs = [
  { view: 'list', label: 'User List' },
  { view: 'update', label: 'Update User Info' },
  { view: 'create', label: 'Create New User' }
]

// Track which sub-page is active: 'list' or 'update'
// const view = ref<'list' | 'update' | 'create'>('list')

function navigate(target: string) {
  if (target === 'users') router.push('/users')
  if (target === 'departments') router.push('/departments')
  if (target === 'roles') router.push('/roles')
}

// function setView(target: 'list' | 'update' | 'create') {
//   view.value = target
// }

const userFields = ref<Field[]>([])
const userList = ref<any[]>([])

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const [deptRes, roleRes, userRes] = await Promise.all([
      fetchDepartments(),
      fetchRoles(),
      fetchUsers()
    ])

    const departments = deptRes.data
    const roles = roleRes.data
    const users = userRes.data
    
    // prepare user field for generic form - another component
    userFields.value = [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'name', label: 'Name', required: true },
      {
        name: 'departmentId',
        label: 'Department',
        type: 'select',
        required: true,
        options: departments.map((d: any) => ({
          label: d.name,
          value: d.id
        }))
      },
      {
        name: 'roleId',
        label: 'Role',
        type: 'select',
        required: true,
        options: roles.map((r: any) => ({
          label: r.name,
          value: r.id
        }))
      }
    ]
  // check for listing status
  if (!users || users.length === 0) {
      error.value = 'No users found'
    } else {
      loading.value = false
      userList.value = users  
    }
  } catch (err) {
    console.error('Failed to load departments or roles', err)
  }
})

</script>

<style scoped>
.sub-navbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.sub-navbar button {
  background: #353a3f;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
.sub-navbar button.active {
  background: #007bff;
}
.sub-navbar button:hover {
  background: #007bff;
}
</style>
