<template>
  <div>
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

async function updateUser() {
  try {
    const response = await axios.put(`http://localhost:5001/users/${userId.value}`, {
      email: email.value,
      name: name.value,
      departmentId: departmentId.value || undefined,
      roleId: roleId.value || undefined
    })
    result.value = response.data
    error.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Update failed'
    result.value = null
  }
}
</script>