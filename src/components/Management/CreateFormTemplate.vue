<template>
  <div>
    <h2>Create User</h2>
    <form @submit.prevent="createUser">
      <label>Email:
        <input v-model="email" required />
      </label>
      <br />
      <label>Name:
        <input v-model="name" required />
      </label>
      <br />
      <label>Department:
        <select v-model="departmentId">
          <option value="">-- Select Department --</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
        </select>
      </label>
      <br />
      <label>Role:
        <select v-model="roleId">
          <option value="">-- Select Role --</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
      </label>
      <br />
      <button type="submit">Create</button>
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

const userId = ref('')
const email = ref('')
const name = ref('')
const departmentId = ref('')
const roleId = ref('')
const result = ref(null)
const error = ref(null)

const departments = ref([])
const roles = ref([])

onMounted(async () => {
  try {
    const [deptRes, roleRes] = await Promise.all([
      axios.get('http://localhost:5001/departments'),
      axios.get('http://localhost:5001/roles')
    ])
    departments.value = deptRes.data
    roles.value = roleRes.data
  } catch (err) {
    // Optionally handle error
  }
})

async function createUser() {
  try {
    const response = await axios.post(`http://localhost:5001/users`, {
      email: email.value,
      name: name.value,
      departmentId: departmentId.value || undefined,
      roleId: roleId.value || undefined
    })
    result.value = response.data
    error.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Create failed'
    result.value = null
  }
}

async function createRole() {
  try {
    const response = await axios.post(`http://localhost:5001/roles`, {
      name: name.value || undefined
    })
    result.value = response.data
    error.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Create failed'
    result.value = null
  }
}
async function createDepartment() {
  try {
    const response = await axios.post(`http://localhost:5001/departments`, {
      name: name.value || undefined
    })
    result.value = response.data
    error.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Create failed'
    result.value = null
  }
}
</script>
