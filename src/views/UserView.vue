<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UsersUpdateForm from '../components/user/UsersUpdateForm.vue';
import UserCard from '../components/user/UserCard.vue';
import axios from 'axios'

const users = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5001/users')
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
    <UsersUpdateForm />
    <div v-if="loading">Loading users...</div>
    <div v-else-if="error" style="color:red;">{{ error }}</div>
    <div v-else>
      <UserCard v-for="user in users" :key="user.id" :user="user" />
      <div v-if="users.length === 0">No users found.</div>
    </div>
  </main>
</template>
