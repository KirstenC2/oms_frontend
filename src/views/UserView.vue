<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UsersUpdateForm from '../components/Management/UsersUpdateForm.vue';
import UsersCreateForm from '../components/Management/UsersCreateForm.vue';
import UserCard from '../components/Management/UserCard.vue';
import axios from 'axios'

const users = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

// Track which sub-page is active: 'list' or 'update'
const view = ref<'list' | 'update' | 'create'>('list')

function navigate(target: string) {
  if (target === 'users') router.push('/users')
  if (target === 'departments') router.push('/departments')
  if (target === 'roles') router.push('/roles')
}

function setView(target: 'list' | 'update' | 'create') {
  view.value = target
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5001/users')
    console.log('Fetched users:', res.data) // Debugging line
    users.value = res.data
    error.value = null
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch users'
    users.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main>
    <nav class="sub-navbar">
      <button :class="{active: view === 'list'}" @click="setView('list')">User List</button>
      <button :class="{active: view === 'update'}" @click="setView('update')">Update User Info</button>
      <button :class="{active: view === 'create'}" @click="setView('create')">Create New User</button>
    </nav>
    <UsersUpdateForm v-if="view === 'update'" />
    <UsersCreateForm v-else-if="view === 'create'" />
    <div v-if="view === 'list'">
      <div v-if="loading">Loading users...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else>
        <UserCard v-for="user in users" :key="user.id" :user="user" />
        <div v-if="users.length === 0">No users found.</div>
      </div>
    </div>
  </main>
</template>

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
