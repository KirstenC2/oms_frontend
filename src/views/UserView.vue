<template>
  <main>
    <SubNavBar :tabs="userTabs" :view="view" @change="setView" />
    <h2>Users</h2>
    <UsersUpdateForm v-if="view === 'update'" />
    <CreateUserPage v-else-if="view === 'create'" title="Create User" :fields="userFields"
      :submitHandler="createUser" />
    <div v-else-if="view === 'list'">
      <div v-if="loading">Loading users...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else class="user-container">
        <CardContent v-for="user in userList" :key="user.id" :item="user" type="user" @refreshRequest="() => {
            console.log('Event received ✅');
            loadUsers()
          }"/>
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
import CardContent from '../components/CardContent.vue'
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import axios from 'axios'
import type { Field } from '@/components/form/types'
import { fetchDepartments, fetchRoles, fetchUsers, createUser } from '@/components/utils/api'
import CreateUserPage from './users/CreateUserPage.vue';


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

const loadUsers = async () => {
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
}

onMounted(async () => {
  loadUsers()
  console.log('Users loaded:', userList.value)
})

</script>

<style scoped>
.user-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.user-card {
  flex: 1 1 calc(33.333% - 16px);
  /* 3 in a row with gap considered */
  box-sizing: border-box;
}
</style>
