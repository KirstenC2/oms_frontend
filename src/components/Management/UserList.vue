<template>
  <div>
    <h2>All Users</h2>
    <div v-if="loading">Loading users...</div>
    <div v-else-if="error" style="color:red;">{{ error }}</div>
    <div v-else>
      <UserCard v-for="user in users" :key="user.id" :user="user" />
      <div v-if="users.length === 0">No users found.</div>
    </div>
    <h2>Update User</h2>
    <form @submit.prevent="updateUser">
      <label>User ID:
        <input v-model="userId" required />
      </label>
      <br />
      <label>Email:
        <input v-model="email" required />
      </label>
      <br />
      <label>Name:
        <input v-model="name" required />
      </label>
      <br />
      <button type="submit">Update</button>
    </form>
    <div v-if="result">
      <h3>Result:</h3>
      <pre>{{ result }}</pre>
    </div>
    <div v-if="error" style="color:red;">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import UserCard from '../Management/UserCard.vue'

const users = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5001/users')
    users.value = res.data
    error.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch users'
    users.value = []
  } finally {
    loading.value = false
  }
})

const userId = ref('')
const email = ref('')
const name = ref('')
const result = ref(null)
const error = ref(null)

async function updateUser() {
  try {
    const response = await axios.put(`http://localhost:5001/users/${userId.value}`, {
      email: email.value,
      name: name.value
    })
    result.value = response.data
    error.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Update failed'
    result.value = null
  }
}
</script>
