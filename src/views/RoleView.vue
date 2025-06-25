<template>
  <div>
    <h2>Roles</h2>
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
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CardContent from '../components/CardContent.vue'
import axios from 'axios'

const roles = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5001/roles')
    console.log('Fetching roles from API...') // Debugging line
    roles.value = res.data
    console.log('Fetched roles:', res.data) // Debugging line
    error.value = null
  } catch (err: any) {
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
